import os
from pymongo import MongoClient
from core.config import MONGODB_URI, DATABASE_NAME

# Local MongoDB URI
LOCAL_URI = "mongodb://localhost:27017"

def migrate():
    try:
        print("Starting migration...")
        
        # Local connection
        local_client = MongoClient(LOCAL_URI)
        local_db = local_client[DATABASE_NAME]
        
        # Atlas connection
        atlas_client = MongoClient(MONGODB_URI)
        atlas_db = atlas_client[DATABASE_NAME]
        
        collections = ['users', 'suspect_logs', 'emergency_contacts', 'known_persons']
        
        for coll_name in collections:
            print(f"Migrating {coll_name}...")
            count = 0
            # Fetch all from local
            docs = list(local_db[coll_name].find())
            if not docs:
                print(f"No documents found in local {coll_name}")
                continue
            
            # Insert into Atlas (batch)
            try:
                # Clear existing maybe? No, let's just insert and catch duplicates
                for doc in docs:
                    # Check if already exists to avoid duplicate key errors
                    # This is slow but safe for small datasets
                    query = {"_id": doc["_id"]}
                    if not atlas_db[coll_name].find_one(query):
                        atlas_db[coll_name].insert_one(doc)
                        count += 1
                
                print(f"Successfully migrated {count} documents to {coll_name}")
            except Exception as e:
                print(f"Warning during {coll_name} migration: {e}")
                
        print("Migration complete!")

    except Exception as e:
        print(f"Error during migration: {e}")

if __name__ == "__main__":
    confirm = input("This will copy data from Local MongoDB to Atlas. Type 'yes' to proceed: ")
    if confirm.lower() == 'yes':
        migrate()
    else:
        print("Migration cancelled.")
