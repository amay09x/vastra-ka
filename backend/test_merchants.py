from app.services.merchant_search_service import MerchantSearchService

merchant = MerchantSearchService()

results = merchant.search_merchants(
    "Levi's 511 Slim Fit Jeans"
)

for shop in results:
    print(shop)