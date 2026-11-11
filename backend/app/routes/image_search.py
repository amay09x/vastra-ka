"""
backend/app/routes/image_search.py
==================================
Visual product search route backed by Azure Blob Storage.

Uploads the user's image to the ``vastra-images`` container in Azure Blob
Storage (configured via ``AZURE_STORAGE_CONNECTION_STRING``) and forwards the
resulting blob URL to ``ImageSearchService`` for Google Lens matching.
"""

import os
import uuid
from pathlib import Path

from dotenv import load_dotenv
from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.concurrency import run_in_threadpool

from app.services.image_search_service import ImageSearchService

try:
    from azure.core.exceptions import AzureError, ResourceExistsError
    from azure.storage.blob import BlobServiceClient, ContentSettings
except ImportError:  # pragma: no cover - allows app startup before SDK install
    AzureError = Exception
    ResourceExistsError = Exception
    BlobServiceClient = None
    ContentSettings = None

load_dotenv()

router = APIRouter()
image_search_service = ImageSearchService()

CONTAINER_NAME = "vastra-images"

_PLACEHOLDER_MARKERS = (
    "placeholder",
    "your-storage",
    "your_storage",
    "your-azure-storage",
    "<account",
    "<key>",
)


def _is_placeholder_storage_connection(conn_str: str) -> bool:
    """Return True if the connection string is empty or an obvious placeholder."""
    lowered = conn_str.strip().lower()
    if not lowered:
        return True
    return any(marker in lowered for marker in _PLACEHOLDER_MARKERS)


def _upload_image_to_blob(
    image_bytes: bytes,
    filename: str | None,
    content_type: str,
    connection_string: str,
) -> str:
    """Upload image bytes to Azure Blob Storage and return the public blob URL."""
    blob_service_client = BlobServiceClient.from_connection_string(connection_string)
    container_client = blob_service_client.get_container_client(CONTAINER_NAME)

    if not container_client.exists():
        try:
            container_client.create_container(public_access="blob")
        except ResourceExistsError:
            pass

    extension = Path(filename or "upload.jpg").suffix.lower()
    if not extension or len(extension) > 10:
        extension = ".jpg"

    blob_name = f"{uuid.uuid4().hex}{extension}"
    blob_client = container_client.get_blob_client(blob_name)

    blob_client.upload_blob(
        image_bytes,
        overwrite=True,
        content_settings=ContentSettings(content_type=content_type),
    )

    return blob_client.url


@router.post("/image-search")
async def image_search(file: UploadFile = File(...)):
    """Upload an image to Azure Blob Storage and search for visual matches."""
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Please upload an image file.",
        )

    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(
            status_code=400,
            detail="Uploaded image is empty.",
        )

    if BlobServiceClient is None or ContentSettings is None:
        raise HTTPException(
            status_code=500,
            detail=(
                "azure-storage-blob is not installed. "
                "Run 'pip install azure-storage-blob' to enable image search."
            ),
        )

    connection_string = os.getenv("AZURE_STORAGE_CONNECTION_STRING", "").strip()
    if _is_placeholder_storage_connection(connection_string):
        raise HTTPException(
            status_code=503,
            detail=(
                "Azure Blob Storage is not configured. "
                "Set a valid AZURE_STORAGE_CONNECTION_STRING in backend/.env."
            ),
        )

    try:
        image_url = await run_in_threadpool(
            _upload_image_to_blob,
            image_bytes,
            file.filename,
            file.content_type,
            connection_string,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Invalid AZURE_STORAGE_CONNECTION_STRING format: {exc}",
        ) from exc
    except AzureError as exc:
        raise HTTPException(
            status_code=502,
            detail={
                "message": "Azure Blob Storage upload failed.",
                "azure_error": str(exc),
            },
        ) from exc

    lens_results = await run_in_threadpool(
        image_search_service.search_visual_matches,
        image_url,
    )

    return {
        "success": lens_results.get("success", False),
        "filename": file.filename,
        "image_url": image_url,
        "results": lens_results.get("results", []),
        "error": lens_results.get("error"),
    }
