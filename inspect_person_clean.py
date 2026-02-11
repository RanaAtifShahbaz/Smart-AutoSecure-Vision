from core.config import MONGODB_URI, DATABASE_NAME
from pymongo import MongoClient

client = MongoClient(MONGODB_URI)
db = client[DATABASE_NAME]

person = db.known_persons.find_one()

if person:
    for k, v in person.items():
        if isinstance(v, bytes):
            print(f"{k}: <binary data, length {len(v)}>")
        else:
            print(f"{k}: {v}")
else:
    print("No person found")
