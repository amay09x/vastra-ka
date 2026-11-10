import json

import os



from fastapi import APIRouter, HTTPException

from groq import Groq

from pydantic import BaseModel, Field

from dotenv import load_dotenv





load_dotenv()



router = APIRouter()




INDIAN_FASHION_LANGUAGE_RULES = """

=========================================================

INDIAN FASHION LANGUAGE RULES

=========================================================



VASTRA is made for users in India.



All user-facing fashion advice must sound natural to an Indian

English-speaking user.



Use simple Indian fashion vocabulary that people commonly use

when talking about clothes in India.



IMPORTANT:

- Prefer "trousers" instead of "pants" when a general lower garment

  is meant.

- Prefer "trousers" instead of "chinos" in styling advice unless

  the user specifically asked for chinos or the exact product title

  contains the word "chinos".

- Use "jeans" when the garment is jeans.

- Use "track pants" for track pants.

- Use "shorts" for shorts.

- Use "wardrobe" instead of "closet".

- Use "formal shirt" instead of "dress shirt".

- "Sneakers", "hoodie", "blazer", "joggers", "cargo trousers",

  "jeans", "t-shirt" and "shirt" are acceptable.

- Avoid American-only or overly Western wording such as

  "fall", "closet", "dress shirt", "pants" and "chinos" when

  a natural Indian alternative works.

- Do not force British spelling or make the language unnatural.

  It should simply feel familiar to an Indian user.

- Do not modify actual product titles supplied by search.

- Do not replace a garment with a different garment just to follow

  this vocabulary rule.

- Do not invent clothing details.



For styling advice, use practical Indian situations such as:

college, office, wedding functions, family events, parties, dates,

dinners, festivals, outings, travel and everyday wear.



When explaining a recommendation, focus on the actual reason:

colour contrast, fit when known, proportion, occasion, layering,

versatility, or a standout detail of the product.

"""





class ProductDetailRequest(BaseModel):

    product_id: str

    immersive_api: str | None = None



    # Lightweight product data from the card.

    title: str | None = None

    source: str | None = None

    brand: str | None = None

    thumbnail: str | None = None

    images: list = Field(default_factory=list)

    price: str | None = None

    original_price: str | None = None

    extracted_price: float | None = None

    extracted_original_price: float | None = None

    product_link: str | None = None

    extensions: list = Field(default_factory=list)

    rating: float | None = None

    review_count: int | None = None

    customer_reviews: list = Field(default_factory=list)



    # VASTRA ranking data from the initial search.

    score: int | None = None

    value_score: int | None = None

    trend_score: int | None = None

    score_breakdown: dict = Field(default_factory=dict)

    why_recommended: list = Field(default_factory=list)



    # Original request, used only to personalize the detail advice.

    user_request: str = ""





def _safe_json(content):

    try:

        return json.loads(content)

    except json.JSONDecodeError:

        return {}





def _generate_vastra_insights(product, user_request):

    api_key = os.getenv("GROQ_API_KEY")



    if not api_key:

        return {}



    client = Groq(api_key=api_key)

    real_reviews = product.get("customer_reviews") or []



    if real_reviews:

        review_instruction = f"""

    REAL CUSTOMER REVIEWS ARE AVAILABLE.



    The following review data was actually retrieved from the retailer/product

    source:



    {json.dumps(

        real_reviews,

        ensure_ascii=False,

        indent=2

    )}



You MAY summarize these real reviews into short, natural customer insights.



STRICT REVIEW RULES:

- Use ONLY the supplied review text.

- Do not add information that is not present in the reviews.

- Do not invent reviewer names.

- Do not invent ratings.

- Do not invent dates.

- Do not invent purchase experiences.

- Do not invent claims about quality, fit, comfort, colour, material,

  delivery, or anything else.

- Do not claim that all customers agree.

- Do not claim that you read all reviews.

- Do not create fake quotations.

- Do not change the meaning of the original reviews.

- These must be summaries of the supplied real reviews.

    """

    else:

        review_instruction = """

    NO INDIVIDUAL CUSTOMER REVIEW TEXT IS AVAILABLE.



    The product may have an aggregate rating and review count, such as

    "4.5 stars" and "35 reviews", but no actual customer review text

    has been retrieved.



Therefore:



- DO NOT generate review-style takeaways.

- DO NOT generate customer opinions.

- DO NOT generate reviewer names.

- DO NOT generate review quotes.

- DO NOT generate purchase experiences.

- DO NOT infer what customers liked or disliked.

- DO NOT imply that individual reviews were read.



The "review_style_takeaways" field MUST be an empty array [].

"""





    prompt = f"""

You are VASTRA, a personal fashion stylist.



Create useful product-page guidance from ONLY the supplied data.



Do not invent fabric, fit, sizes, delivery dates, discounts, materials,

usage experiences, or any other product facts that are not present.



=========================================================

INDIAN FASHION LANGUAGE RULES

=========================================================



VASTRA is made for users in India.



All user-facing fashion advice must sound natural to an Indian

English-speaking user.



Use simple Indian fashion vocabulary that people commonly use

when talking about clothes in India.



IMPORTANT:

- Prefer "trousers" instead of "pants" when a general lower garment

  is meant.

- Prefer "trousers" instead of "chinos" in styling advice unless

  the user specifically asked for chinos or the exact product title

  contains the word "chinos".

- Use "jeans" when the garment is jeans.

- Use "track pants" for track pants.

- Use "shorts" for shorts.

- Use "wardrobe" instead of "closet".

- Use "formal shirt" instead of "dress shirt".

- "Sneakers", "hoodie", "blazer", "joggers", "cargo trousers",

  "jeans", "t-shirt" and "shirt" are acceptable.

- Avoid American-only or overly Western wording such as

  "fall", "closet", "dress shirt", "pants" and "chinos" when

  a natural Indian alternative works.

- Do not force British spelling or make the language unnatural.

  It should simply feel familiar to an Indian user.

- Do not modify actual product titles supplied by search.

- Do not replace a garment with a different garment just to follow

  this vocabulary rule.

- Do not invent clothing details.



For styling advice, use practical Indian situations such as:

college, office, wedding functions, family events, parties, dates,

dinners, festivals, outings, travel and everyday wear.



When explaining a recommendation, focus on the actual reason:

colour contrast, fit when known, proportion, occasion, layering,

versatility, or a standout detail of the product.



USER REQUEST:

{user_request or "No original request was supplied."}



PRODUCT DATA:

{json.dumps(product, ensure_ascii=False, indent=2)}



Return ONLY valid JSON with exactly these fields:



{{

  "vastra_advice": "2-4 sentence practical advice about how this product can be used.",

  "how_it_fits": "1-3 sentences explaining how the product relates to the user's request.",

  "pairing_ideas": ["item 1", "item 2", "item 3"],

  "good_to_know": ["fact 1", "fact 2", "fact 3"],

  "review_style_takeaways": []

}}



For review_style_takeaways:



- If REAL CUSTOMER REVIEWS are supplied, summarize only those reviews.

- If no real customer review text is supplied, return [].

- Never create review content from rating/count alone.



Rules:

- Use only supplied product facts.

- Do not claim the product is better than another product.

- Do not fabricate technical specifications.

- Pairing ideas may be styling suggestions, but must be reasonable

  for the product and request.

- good_to_know should contain factual points from the supplied data.

- Keep everything concise and useful.



REVIEW RULE:

{review_instruction}



If real customer reviews were supplied, review_style_takeaways may contain

1-3 concise summaries supported directly by those reviews.



If real customer reviews were NOT supplied, review_style_takeaways MUST be [].

"""



    try:

        response = client.chat.completions.create(

            model=os.getenv("GROQ_CHAT_MODEL", "openai/gpt-oss-20b"),

            temperature=0.7,

            messages=[

                {

                    "role": "system",

                    "content": (

                        "You are VASTRA, a practical and fashionable personal stylist. "

                        "Never present AI-generated review previews as real customer reviews. "

                        "Use Indian fashion language and follow the VASTRA Indian fashion language rules."

                        + INDIAN_FASHION_LANGUAGE_RULES

                    ),

                },

                {

                    "role": "user",

                    "content": prompt,

                },

            ],

            response_format={"type": "json_object"},

        )



        content = response.choices[0].message.content or "{}"

        data = _safe_json(content)



        return {

            "vastra_advice": data.get("vastra_advice", ""),

            "how_it_fits": data.get("how_it_fits", ""),

            "pairing_ideas": data.get("pairing_ideas", [])[:4],

            "good_to_know": data.get("good_to_know", [])[:4],

            "review_style_takeaways": (

    data.get("review_style_takeaways", [])[:3]

    if real_reviews

    else []

),

        }



    except Exception as exc:

        print(

            "⚠️ VASTRA detail advice error: "

            f"{type(exc).__name__}: {exc}"

        )

        return {}





@router.post("/product-details")

def product_details(request: ProductDetailRequest):

    if not request.product_id:

        raise HTTPException(

            status_code=400,

            detail="product_id is required.",

        )

    detail_data = {}



    base_product = request.model_dump()

    user_request = base_product.pop(

        "user_request",

        ""

    )



# =========================================================
    # BRIGHT DATA PRODUCT DATA
    # =========================================================

    # Bright Data already supplied the product data during
    # the shopping search. Do not perform another Serper
    # search or retailer-page scrape here.
    #
    # Individual customer reviews are intentionally disabled.

    detail_data = {
        "product_link": request.product_link,
        "customer_reviews": [],
    }

    # Keep the lightweight product data supplied by Bright Data.

    product = {

        **base_product,

        **detail_data,

    }



    # Keep the original image/title/price when the detail response does

    # not contain those fields.

    for key in [

        "product_id",

        "title",

        "source",

        "brand",

        "product_link",

        "thumbnail",

        "images",

        "price",

        "original_price",

        "extracted_price",

        "extracted_original_price",

        "rating",

        "review_count",

        "extensions",

    ]:

        if product.get(key) in (None, "", []):

            product[key] = base_product.get(key)



    insights = _generate_vastra_insights(

        product,

        user_request,

    )



    product.update(insights)



    # Store data from the immersive response in the same shape the

    # frontend can consume.

    stores = product.get("stores", []) or []



    # When Immersive Product API provides store offers, use them.

    # Otherwise preserve the original Shopping result as a fallback

    # so the detail page still has a usable source link.

    if not stores and product.get("product_link"):

        stores = [

            {

                "store": product.get("source") or "View Product",

                "title": product.get("title"),

                "link": product.get("product_link"),

                "price": product.get("price"),

                "extracted_price": product.get("extracted_price"),

            }

        ]



    product["stores"] = stores

    product["available_on"] = stores



    if stores:

        product["buy_now"] = stores[0]



    return {

        "success": True,

        "product": product,

    }
