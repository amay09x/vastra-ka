import os
from typing import List

from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from groq import Groq
from pydantic import BaseModel, Field

load_dotenv()


router = APIRouter(
    prefix="/stylist-vision",
    tags=["Stylist Vision"],
)


# ============================================================
# REQUEST MODEL
# ============================================================

class StylistVisionRequest(BaseModel):

    tool: str = "analyze"

    images: List[str] = Field(
        default_factory=list
    )


# ============================================================
# VASTRA BASE STYLE RULES
# ============================================================

BASE_PROMPT = """
You are VASTRA, a personal fashion stylist for Indian users.

You are analysing the user's own uploaded clothing or outfit photo(s).

Use ONLY what can reasonably be seen in the image.

Do not invent:
- brand
- fabric
- exact size
- body measurements
- skin tone
- weather
- occasion
- price
- availability

unless the user has explicitly provided that information.

Use natural Indian English.

Prefer familiar Indian fashion wording such as:
- trousers
- jeans
- shirt
- T-shirt
- hoodie
- blazer
- sneakers
- shoes
- wardrobe
- college
- office
- party
- wedding
- family function
- festival
- everyday wear

Avoid unnecessary American fashion language.

Do not change the actual name of a product or clothing label
that is visible in the image.

Speak naturally like a good human stylist.

Do not praise everything.

When something looks mismatched, say it clearly.

When something already works well, say that clearly too.

Be practical, specific and useful.

FORMAT RULES:

Keep the response approximately the same length as a normal helpful
stylist response. Do not make it unnecessarily long.

Make the response easy to scan.

Use short paragraphs and short bullet points instead of large blocks
of text.

Use the section names provided in the task.

Do NOT use Markdown bold syntax such as **text**.
Do NOT use Markdown headings such as # Heading.
Do NOT use tables.

For section headings, write the heading as plain text on its own line.

For individual recommendations, use short numbered points or bullet
points.

Keep each point focused on one idea.

Do not repeat the same recommendation in different sections.

Do not add a long introduction or conclusion.

Do not give a numerical style score unless specifically requested.
"""


# ============================================================
# PROMPTS
# ============================================================

def get_prompt(tool: str) -> str:

    if tool == "complete":

        return BASE_PROMPT + """
        
TASK:
COMPLETE AND IMPROVE MY LOOK

Check the complete outfit.

Look carefully at:

- colour combination
- pieces that do not work together
- proportions
- balance
- footwear
- accessories
- layering
- overall styling

Give the response naturally.

Use this exact structure:

WHAT'S WORKING
• 1-3 short, specific points.

WHAT I WOULD CHANGE
• 1-3 short, practical points.

TRY THIS INSTEAD
Give 1 concrete replacement or addition only when useful.

WHY IT WORKS
Explain the main improvement in 1-2 short sentences.

FINISHING TOUCH
Give one useful footwear or accessory suggestion only if relevant.

Keep every point concise.
Do not repeat information.


IMPORTANT:

Do not force changes.

If the outfit already works well, say that.

The goal is not to find something wrong.

The goal is to make the user's outfit look better.
"""


    if tool == "wardrobe":

        return BASE_PROMPT + """
        
TASK:
ANALYSE PART OF MY WARDROBE

The images show clothing pieces from the user's wardrobe.

Identify ONLY pieces that are clearly visible.

Group them naturally into categories such as:

- shirts
- T-shirts
- trousers
- jeans
- jackets
- footwear
- accessories

Then explain which pieces can work together.

Do not invent pieces that are not visible.

Give practical combinations.

For each outfit explain briefly why the colours and pieces work together.

Do not tell the user to buy new clothing unless there is a genuine wardrobe gap.

If the supplied photos are only a portion of the wardrobe,
say that you are analysing the pieces shown.
"""

    return BASE_PROMPT + """

TASK:
ANALYSE MY OUTFIT

Look carefully at the uploaded outfit.

Evaluate:

- overall appearance
- colour combination
- fit, only where it can be judged visually
- proportions
- balance
- occasion suitability, only when reasonably inferable
- what is working
- what could be improved
- useful colour direction
- footwear
- accessories

Use this exact structure:

OVERALL
2-3 short sentences describing the overall look.

WHAT'S WORKING
• 2-4 specific observations.

WAYS TO IMPROVE
• 1-4 practical suggestions.

COLOUR DIRECTION
• 1-3 useful colour combinations based only on what is visible.

FINISHING TOUCHES
• Only mention footwear/accessories when genuinely useful.

BEST SINGLE CHANGE
One short sentence describing the change that would make the biggest
difference.

Keep the response concise and easy to scan.


END WITH THIS:

Give ONE sentence explaining the single change that would make
the biggest improvement.

Do not use a rigid numeric score unless the user asks for one.
"""


# ============================================================
# GROQ CALL
# ============================================================

def call_groq(
    client: Groq,
    model: str,
    prompt: str,
    images: List[str],
) -> str:

    content = [
        {
            "type": "text",
            "text": prompt,
        }
    ]

    for image in images:

        content.append(
            {
                "type": "image_url",
                "image_url": {
                    "url": image,
                },
            }
        )

    response = client.chat.completions.create(

        model=model,

        messages=[
            {
                "role": "user",
                "content": content,
            }
        ],

        temperature=0.45,

        max_completion_tokens=1400,
    )

    answer = ""

    if response.choices:

        answer = (
            response
            .choices[0]
            .message
            .content
            or ""
        )

    return answer.strip()


# ============================================================
# WARDROBE SYNTHESIS
# ============================================================

def build_wardrobe_summary(
    client: Groq,
    model: str,
    analyses: List[str],
) -> str:

    combined = "\n\n".join(
        f"WARDROBE GROUP {index + 1}:\n{analysis}"
        for index, analysis in enumerate(analyses)
    )

    prompt = f"""
You are VASTRA, an Indian personal fashion stylist.

The following are analyses of different groups of clothing
from the user's wardrobe.

Combine them into ONE useful wardrobe response.

Do not invent clothing pieces.

Use only pieces mentioned in the supplied analyses.

IMPORTANT:
Different groups may contain clothing that can be combined
with each other.

Create useful combinations across the supplied groups.

Use natural Indian English.

Keep the response easy to scan.

Use this exact structure:

WHAT I SEE
• Short list of the visible pieces.

OUTFIT 1
• Combination
• Why it works

OUTFIT 2
• Combination
• Why it works

OUTFIT 3
• Combination
• Why it works

WARDROBE GAP
One short recommendation only if something important is genuinely
missing.

Do not invent clothing items or colours that are not visible.
Keep each outfit concise.

Otherwise say:

"Your wardrobe already gives you enough options to work with."

WARDROBE ANALYSES:

{combined}
"""

    response = client.chat.completions.create(

        model=model,

        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],

        temperature=0.45,

        max_completion_tokens=1800,
    )

    answer = ""

    if response.choices:

        answer = (
            response
            .choices[0]
            .message
            .content
            or ""
        )

    return answer.strip()


# ============================================================
# ROUTE
# ============================================================

@router.post("")
def stylist_vision(
    request: StylistVisionRequest
):

    # --------------------------------------------------------
    # BASIC VALIDATION
    # --------------------------------------------------------

    if not request.images:

        raise HTTPException(
            status_code=400,
            detail="No images were supplied.",
        )


    tool = (
        request.tool or "analyze"
    ).strip().lower()


    if tool not in {
        "analyze",
        "complete",
        "wardrobe",
    }:

        raise HTTPException(
            status_code=400,
            detail="Unsupported stylist tool.",
        )


    # Analyze and Complete use one image.

    if tool in {
        "analyze",
        "complete",
    }:

        if len(request.images) != 1:

            raise HTTPException(
                status_code=400,
                detail=(
                    "This stylist option requires exactly "
                    "one image."
                ),
            )


    # Wardrobe can contain up to 12 images.

    if tool == "wardrobe":

        if len(request.images) > 12:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Wardrobe analysis accepts up to "
                    "12 images."
                ),
            )


    # --------------------------------------------------------
    # API KEY
    # --------------------------------------------------------

    api_key = os.getenv(
        "GROQ_API_KEY"
    )

    if not api_key:

        raise HTTPException(
            status_code=500,
            detail=(
                "GROQ_API_KEY is missing "
                "from backend/.env"
            ),
        )


    # --------------------------------------------------------
    # CURRENT GROQ VISION MODEL
    # --------------------------------------------------------
    #
    # qwen/qwen3.6-27b is deprecated.
    #
    # qwen/qwen3.8-27b supports vision.
    #
    # --------------------------------------------------------

    model = (
        os.getenv(
            "GROQ_VISION_MODEL"
        )
        or "qwen/qwen3.8-27b"
    )


    client = Groq(
        api_key=api_key
    )


    # ========================================================
    # ANALYZE / COMPLETE
    # ========================================================

    if tool in {
        "analyze",
        "complete",
    }:

        try:

            answer = call_groq(
                client=client,
                model=model,
                prompt=get_prompt(tool),
                images=request.images,
            )

            if not answer:

                raise HTTPException(
                    status_code=502,
                    detail=(
                        "VASTRA returned an empty "
                        "visual analysis."
                    ),
                )

            return {
                "success": True,
                "tool": tool,
                "response": answer,
            }


        except HTTPException:

            raise


        except Exception as exc:

            print(
                "\n===== VASTRA VISION ERROR ====="
            )

            print(
                repr(exc)
            )

            print(
                "================================\n"
            )

            # Return the real error during development
            # instead of hiding it behind a generic message.

            raise HTTPException(
                status_code=500,
                detail=(
                    f"VASTRA vision analysis failed: "
                    f"{str(exc)}"
                ),
            )


    # ========================================================
    # WARDROBE
    # ========================================================
    #
    # Groq accepts a maximum of 3 images per vision request.
    #
    # So:
    #
    # 12 wardrobe photos
    #       ↓
    # 3 + 3 + 3 + 3
    #       ↓
    # four vision calls
    #       ↓
    # one final wardrobe synthesis
    #
    # This allows the user to upload the whole wardrobe
    # without violating the vision model's image limit.
    #
    # ========================================================

    try:

        batches = [

            request.images[
                start:start + 3
            ]

            for start in range(
                0,
                len(request.images),
                3,
            )
        ]


        batch_analyses = []


        for index, batch in enumerate(
            batches
        ):

            print(
                f"\nVASTRA → Analysing wardrobe "
                f"group {index + 1}/{len(batches)} "
                f"({len(batch)} images)"
            )


            batch_prompt = (
                get_prompt("wardrobe")
                + f"""

This is wardrobe group
{index + 1} of {len(batches)}.

Analyse only the clothing visible
in these images.
"""
            )


            analysis = call_groq(
                client=client,
                model=model,
                prompt=batch_prompt,
                images=batch,
            )


            if analysis:

                batch_analyses.append(
                    analysis
                )


        if not batch_analyses:

            raise HTTPException(
                status_code=502,
                detail=(
                    "VASTRA could not analyse "
                    "the uploaded wardrobe."
                ),
            )


        # ----------------------------------------------------
        # COMBINE THE GROUP RESULTS
        # ----------------------------------------------------

        final_answer = build_wardrobe_summary(
            client=client,
            model=model,
            analyses=batch_analyses,
        )


        if not final_answer:

            raise HTTPException(
                status_code=502,
                detail=(
                    "VASTRA could not create "
                    "the final wardrobe suggestions."
                ),
            )


        return {

            "success": True,

            "tool": "wardrobe",

            "response": final_answer,

            "groups_analysed":
                len(batch_analyses),

        }


    except HTTPException:

        raise


    except Exception as exc:

        print(
            "\n===== VASTRA WARDROBE ERROR ====="
        )

        print(
            repr(exc)
        )

        print(
            "===================================\n"
        )


        raise HTTPException(
            status_code=500,
            detail=(
                f"VASTRA wardrobe analysis failed: "
                f"{str(exc)}"
            ),
        )