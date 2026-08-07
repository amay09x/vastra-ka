import os
import requests

from dotenv import load_dotenv

load_dotenv()


class ImmersiveProductService:

    def get_details(self, immersive_api_url):

        if not immersive_api_url:
            return {}

        response = requests.get(
            immersive_api_url,
            params={
                "api_key": os.getenv("SERPAPI_KEY")
            }
        )

        data = response.json()

        print("\n========= IMMERSIVE RESPONSE =========\n")
        print(data)
        print("\n=====================================\n")

        return data