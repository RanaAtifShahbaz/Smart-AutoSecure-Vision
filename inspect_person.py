from core.config import MONGODB_URI, DATABASE_NAME

client = MongoClient(MONGODB_URI)
db = client[DATABASE_NAME]
person = db.known_persons.find_one()
print(json.dumps(person, default=json_util.default, indent=2))
