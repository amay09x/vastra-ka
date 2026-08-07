from app.services.search_service import SearchService

search = SearchService()

results = search.search_products("white shirt under 3000")

for product in results:
    print(vars(product))
    print("-" * 60)