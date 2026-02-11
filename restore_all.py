import json
import os
from pymongo import MongoClient
from core.config import MONGODB_URI, DATABASE_NAME
from datetime import datetime

def restore():
    print(f"Connecting to Atlas: {MONGODB_URI}")
    client = MongoClient(MONGODB_URI)
    db = client[DATABASE_NAME]
    
    # 1. Known Persons
    restore_file('known_persons.json', db['known_persons'], 'serial_no')
    
    # 2. Users
    restore_file('users.json', db['users'], 'email')
    
    # 3. Emergency Contacts
    restore_file('emergency_contacts.json', db['emergency_contacts'], 'phone')
    
    print("Restore All Completed!")

def restore_file(filename, collection, unique_key):
    if not os.path.exists(filename):
        print(f"Skipping {filename}: Not found")
        return
        
    with open(filename, 'r') as f:
        try:
            data = json.load(f)
        except:
            print(f"Skipping {filename}: Invalid JSON")
            return
            
    print(f"Restoring {len(data)} items from {filename} to {collection.name}...")
    
    count = 0
    for item in data:
        # Check uniqueness
        query = {}
        if unique_key in item:
            query[unique_key] = item[unique_key]
        elif '_id' in item:
             # handle _id if string or objectid match?
             # Just skip strictly if _id provided?
             pass
        
        existing = collection.find_one(query)
        if not existing:
            # Fix dates if string
            for k in ['created_at', 'timestamp']:
                if k in item and isinstance(item[k], str):
                    try:
                        item[k] = datetime.strptime(item[k], "%Y-%m-%d %H:%M:%S.%f")
                    except:
                        pass
                        
            # Remove _id to let mongo generate new one (safer for collision) unless we need to preserve legacy IDs
            if '_id' in item:
                del item['_id']
                
            collection.insert_one(item)
            count += 1
            
    print(f"Inserted {count} new items.")

if __name__ == "__main__":
    restore()
