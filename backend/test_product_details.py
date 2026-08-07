from app.services.product_details_service import ProductDetailsService

service = ProductDetailsService()

product = service.get_product_details(
    "5294594756304179503"
)

print(product)