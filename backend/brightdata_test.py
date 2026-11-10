import os
import json
import time
import requests
from urllib.parse import urlencode
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("BRIGHTDATA_API_KEY")
ZONE = os.getenv("BRIGHTDATA_ZONE", "serp_api1")

if not API_KEY:
    raise ValueError("BRIGHTDATA_API_KEY is missing from .env")

DATASET_ID = "gd_ltppk50q18kdw67omz"

# Specific Google Shopping product
google_url = (
    "https://www.google.com/search?"
    "ibp=oshop"
    "&q=Red+Tape+Oxford+Solid+Shirt+for+Men"
    "&prds=imageDocid%3A6116186370374117002%2C"
    "catalogid%3A13148536004840223883%2C"
    "productid%3A4260791316105087465%2C"
    "headlineOfferDocid%3A8082758050759535674%2C"
    "gpcid%3A716144236724771877%2C"
    "mid%3A576462838972891767%2C"
    "pvt%3Aa"
    "&pvorigin=25"
    "&hl=en"
    "&gl=in"
    "&udm=28"
)
payload = [
    {
        "url": google_url,
        "country": "IN"
    }
]

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}


# --------------------------------------------------
# 1. START SCRAPER
# --------------------------------------------------

print("\n🚀 Bright Data Google Shopping Scraper")
print("Zone:", ZONE)
print("Dataset:", DATASET_ID)
print("\n🔗 Product URL:")
print(google_url)

trigger_url = (
    "https://api.brightdata.com/datasets/v3/trigger"
    f"?dataset_id={DATASET_ID}"
    "&format=json"
    "&uncompressed_webhook=true"
)

response = requests.post(
    trigger_url,
    headers=headers,
    json=payload,
    timeout=60
)

print("\nSTATUS:", response.status_code)

if response.status_code != 200:
    print(response.text)
    raise SystemExit

trigger_data = response.json()

print("\n🎯 Trigger response:")
print(json.dumps(trigger_data, indent=2))

snapshot_id = trigger_data.get("snapshot_id")

if not snapshot_id:
    print("\n❌ No snapshot_id returned.")
    raise SystemExit


# --------------------------------------------------
# 2. POLL SNAPSHOT
# --------------------------------------------------

progress_url = (
    f"https://api.brightdata.com/datasets/v3/progress/{snapshot_id}"
)

print("\n⏳ Waiting for Bright Data...")

for attempt in range(30):

    time.sleep(5)

    progress_response = requests.get(
        progress_url,
        headers=headers,
        timeout=30
    )

    if progress_response.status_code != 200:
        print(
            "❌ Progress request failed:",
            progress_response.status_code
        )
        print(progress_response.text)
        break

    progress = progress_response.json()

    print(
        f"Attempt {attempt + 1}/30:",
        progress.get("status"),
        "| records:",
        progress.get("records"),
        "| errors:",
        progress.get("errors")
    )

    if progress.get("status") == "ready":
        break


# --------------------------------------------------
# 3. GET FINAL DATA
# --------------------------------------------------

snapshot_url = (
    f"https://api.brightdata.com/datasets/v3/snapshot/"
    f"{snapshot_id}?format=json"
)

print("\n📦 Fetching final data...")

snapshot_response = requests.get(
    snapshot_url,
    headers=headers,
    timeout=60
)

print("\nSNAPSHOT STATUS:", snapshot_response.status_code)

if snapshot_response.status_code != 200:
    print(snapshot_response.text)
    raise SystemExit


data = snapshot_response.json()

print("\n\n========== ACTUAL SCRAPED DATA ==========\n")

print(json.dumps(data, indent=2, ensure_ascii=False))

print("\n\n========== END ==========\n")