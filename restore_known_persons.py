import json
import os
from pymongo import MongoClient
from core.config import MONGODB_URI, DATABASE_NAME, COLLECTION_NAME
from datetime import datetime

def restore():
    print(f"Connecting to Atlas: {MONGODB_URI}")
    client = MongoClient(MONGODB_URI)
    db = client[DATABASE_NAME]
    collection = db[COLLECTION_NAME]

    # Load from known_persons.json
    filename = 'known_persons.json'
    if not os.path.exists(filename):
        print(f"File {filename} not found!")
        return

    with open(filename, 'r') as f:
        data = json.load(f)

    print(f"Found {len(data)} records in {filename}")

    count = 0
    for item in data:
        # Check if exists by serial_no
        existing = collection.find_one({"serial_no": item['serial_no']})
        if not existing:
            # Fix created_at format if needed
            if isinstance(item.get('created_at'), str):
                try:
                    item['created_at'] = datetime.strptime(item['created_at'], "%Y-%m-%d %H:%M:%S.%f")
                except:
                    pass
            
            # Remove _id to let Mongo generate a new one, or keep it if compatible (ObjectId)
            if '_id' in item:
                del item['_id']

            collection.insert_one(item)
            count += 1
            print(f"Inserted: {item.get('name')} ({item.get('serial_no')})")
        else:
            print(f"Skipping existing: {item.get('name')} ({item.get('serial_no')})")

    print(f"Restoration Complete. Inserted {count} new records.")

if __name__ == "__main__":
    restore()
