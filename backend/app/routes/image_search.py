import requests

from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.image_search_service import ImageSearchService


router = APIRouter()

image_search_service = ImageSearchService()


CLOUDINARY_CLOUD_NAME = "a5pwplda"
CLOUDINARY_UPLOAD_PRESET = "vastra_images"


@router.post("/image-search")
async def image_search(file: UploadFile = File(...)):

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Please upload an image file."
        )

    image_bytes = await file.read()

    cloudinary_url = (
        f"https://api.cloudinary.com/v1_1/"
        f"{CLOUDINARY_CLOUD_NAME}/image/upload"
    )

    response = requests.post(
        cloudinary_url,
        files={
            "file": (
                file.filename,
                image_bytes,
                file.content_type,
            )
        },
        data={
            "upload_preset": CLOUDINARY_UPLOAD_PRESET,
        },
        timeout=30,
    )

    if response.status_code != 200:
        raise HTTPException(
            status_code=502,
            detail={
                "message": "Cloudinary upload failed",
                "cloudinary_response": response.text,
            },
        )

    cloudinary_data = response.json()

    image_url = cloudinary_data.get("secure_url")

    if not image_url:
        raise HTTPException(
            status_code=502,
            detail="Cloudinary did not return an image URL."
        )

    lens_results = image_search_service.search_visual_matches(image_url)

    return {
        "success": lens_results.get("success", False),
        "filename": file.filename,
        "image_url": image_url,
        "results": lens_results.get("results", []),
        "error": lens_results.get("error"),
    }