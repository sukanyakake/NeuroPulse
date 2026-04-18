from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load variables from .env
load_dotenv()

# Fetch from environment
mongo_uri = os.getenv("MONGO_URI")
db_name = os.getenv("DB_NAME", "NeuroPulse")

client = MongoClient(mongo_uri)
db = client[db_name]

# Collection References
telemetry_col = db['telemetry']
mood_col = db['mood_logs']
prediction_col = db['predictions']
users_col = db["users"]