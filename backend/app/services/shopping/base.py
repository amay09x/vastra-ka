from abc import ABC, abstractmethod


class ShoppingProvider(ABC):

    @abstractmethod
    def search_products(self, query: str) -> list:
        """Search shopping products."""
        raise NotImplementedError

    @abstractmethod
    def get_product_details(self, product: dict) -> dict:
        """Get detailed information for one product."""
        raise NotImplementedError