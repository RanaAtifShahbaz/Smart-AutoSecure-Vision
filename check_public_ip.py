import requests
try:
    ip = requests.get('https://api.ipify.org').text
    print(f"Detected Public IP: {ip}")
except Exception as e:
    print(f"Could not check IP: {e}")
