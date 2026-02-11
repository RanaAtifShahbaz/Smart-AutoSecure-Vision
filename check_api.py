import requests
import json

try:
    url = "http://127.0.0.1:5000/api/persons"
    print(f"Fetching from {url}...")
    response = requests.get(url, timeout=5)
    if response.status_code == 200:
        data = response.json()
        print(f"Success! Found {len(data)} persons.")
        for p in data:
            print(f"- {p.get('name')} (Serial: {p.get('serial_no')})")
    else:
        print(f"Failed with status: {response.status_code}")
        print(response.text)
except Exception as e:
    print(f"Error fetching API: {e}")
