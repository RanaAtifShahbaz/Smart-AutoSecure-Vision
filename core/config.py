# config.py
import os
from dotenv import load_dotenv

# Load .env from the root if possible
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))
load_dotenv() # Fallback for current dir

MONGODB_URI = os.getenv(
    "MONGODB_URI",
    "mongodb://localhost:27017"
)

DATABASE_NAME = os.getenv("DATABASE_NAME", "autosecure_db")
COLLECTION_NAME = os.getenv("COLLECTION_NAME", "known_persons")
