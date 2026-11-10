import base64

from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.ai_service import AIService


router = APIRouter()

ai_service = AIService()


@router.post("/outfit-analysis")
async def outfit_analysis(file: UploadFile = File(...)):

    # ------------------------------------------
    # Validate image
    # ------------------------------------------

    if not file.content_type:
        raise HTTPException(
            status_code=400,
            detail="File type could not be determined."
        )

    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Please upload an image file."
        )

    # ------------------------------------------
    # Read image
    # ------------------------------------------

    image_bytes = await file.read()

    if not image_bytes:
        raise HTTPException(
            status_code=400,
            detail="Uploaded image is empty."
        )

    # ------------------------------------------
    # Convert image to base64
    # ------------------------------------------

    encoded_image = base64.b64encode(image_bytes).decode("utf-8")

    image_data_url = (
        f"data:{file.content_type};base64,{encoded_image}"
    )

    # ------------------------------------------
    # AI Analysis
    # ------------------------------------------

    try:

        result = ai_service.analyze_outfit(
            image_data_url
        )

        return {
            "success": True,
            "filename": file.filename,
            "analysis": result
        }

    except Exception as e:

        print("\n===== OUTFIT ANALYSIS ERROR =====")
        print(str(e))
        print("=================================\n")

        raise HTTPException(
            status_code=500,
            detail={
                "message": "Outfit analysis failed.",
                "error": str(e)
            }
        )