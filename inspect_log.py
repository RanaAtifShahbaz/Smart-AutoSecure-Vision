from core.config import MONGODB_URI, DATABASE_NAME
from pymongo import MongoClient

client = MongoClient(MONGODB_URI)
db = client[DATABASE_NAME]

log = db.suspect_logs.find_one()
if log:
    for k, v in log.items():
        if isinstance(v, bytes):
            print(f"{k}: <binary data, length {len(v)}>")
        else:
            print(f"{k}: {v}")
else:
    print("No log found")
