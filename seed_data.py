from core.config import MONGODB_URI, DATABASE_NAME

client = MongoClient(MONGODB_URI)
db = client[DATABASE_NAME]


# Demo User
hashed = generate_password_hash("password123")
db.users.insert_one({
    "name": "Admin User",
    "email": "admin@example.com",
    "password": hashed,
    "is_verified": True,
    "created_at": time.time()
})
print("User created: admin@example.com / password123")

# Demo Log
db.suspect_logs.insert_one({
    "name": "System",
    "action": "Threat Detected",
    "relation": "Suspect",
    "image": "default_avatar.png",
    "time": datetime.now().strftime("%H:%M:%S"),
    "date": datetime.now().strftime("%Y-%m-%d"),
    "timestamp": datetime.now()
})
print("Log entry created.")

# Demo Contact
db.emergency_contacts.insert_one({
    "name": "Security Desk",
    "phone": "911",
    "relation": "Security",
    "created_at": datetime.now()
})
print("Contact created.")
