from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
import os
import certifi

# Load .env
from dotenv import load_dotenv
load_dotenv()

URI = os.getenv("MONGODB_URI")
print(f"Testing Connection to: {URI}")

try:
    # Try with default settings (timeout 10s)
    print("Attempting to connect with tlsCAFile=certifi.where() ...")
    try:
        client = MongoClient(URI, serverSelectionTimeoutMS=5000, tlsCAFile=certifi.where())
        client.admin.command('ping')
        print("SUCCESS: Connected to MongoDB Atlas with certifi!")
    except Exception as e:
        print(f"First attempt failed: {e}")
        print("Retrying with simple SSL context...")
        client = MongoClient(URI, serverSelectionTimeoutMS=10000, tls=True, tlsAllowInvalidCertificates=True)
        client.admin.command('ping')
        print("SUCCESS: Connected to MongoDB Atlas (Unverified SSL)!")

    
    db = client.get_database("autosecure_db")
    print(f"Collections: {db.list_collection_names()}")
    
    # Try inserting a test doc
    # db.test_collection.insert_one({"status": "ok"})
    # print("Insert Successful!")

except ServerSelectionTimeoutError as e:
    print(f"\nFAILURE: Connection Timed Out.\nError: {e}")
    print("\nDIAGNOSIS:")
    print("1. IP Whitelist: Check if your current IP is added in Atlas Network Access.")
    print("2. Firewall: Ensure port 27017 is open outbound.")
    print("3. DNS: Ensure you can resolve the SRV record.")

except Exception as e:
    print(f"\nFAILURE: Unexpected Error: {e}")
