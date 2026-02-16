import os
from pymongo import MongoClient
from core.config import MONGODB_URI, DATABASE_NAME

def setup_db():
    print(f"Connecting to: {MONGODB_URI}")
    try:
        client = MongoClient(MONGODB_URI)
        db = client[DATABASE_NAME]
        
        # Test connection
        client.admin.command('ping')
        print("Connected successfully to Atlas!")

        # Define collections
        collections = ['users', 'suspect_logs', 'emergency_contacts', 'known_persons']
        
        for coll_name in collections:
            if coll_name not in db.list_collection_names():
                db.create_collection(coll_name)
                print(f"Created collection: {coll_name}")
            else:
                print(f"Collection already exists: {coll_name}")

        # Create Indexes
        print("Creating indexes...")
        
        # Unique email for users
        db.users.create_index("email", unique=True)
        
        # Unique serial_no for known_persons
        db.known_persons.create_index("serial_no", unique=True)
        
        # Index on timestamp for logs
        db.suspect_logs.create_index([("timestamp", -1)])
        
        print("Database setup complete!")

    except Exception as e:
        print(f"Error during setup: {e}")

if __name__ == "__main__":
    setup_db()
