import os
import sys
from pymongo import MongoClient
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Add backend directory to sys.path so we can import our custom modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Now import your logic
from database.db_connection import telemetry_col, mood_col, prediction_col
from database.schema import get_telemetry_schema, get_mood_schema, get_prediction_schema
from models.predictor import run_prediction

load_dotenv()

def initialize_database(user_id="sukanya_kake"):
    print(f"--- 🚀 INITIALIZING NEUROPULSE DATABASE FOR: {user_id} ---")

    # 1. Clear existing data to start fresh for the demo
    telemetry_col.delete_many({"user_id": user_id})
    mood_col.delete_many({"user_id": user_id})
    prediction_col.delete_many({"user_id": user_id})
    print("🧹 Old records cleared.")

    # 2. Generate 7 Days of Historical Data
    # This ensures your 'Data Sources' table and 'Analytics' graphs have data.
    for i in range(7, 0, -1):
        target_date = datetime.now() - timedelta(days=i)
        date_str = target_date.strftime("%Y-%m-%d")

        # Mock sensor signals (simulating a mix of healthy and risky days)
        mock_signals = {
            "screen_time": 4.5 + (i * 0.4),  # Decreases as we get to 'today'
            "unlocks": 60 + (i * 10),
            "steps": 3000 + (i * 200),
            "sleep": 6.0 + (i * 0.2)
        }

        # Save to Telemetry Collection
        telemetry_doc = get_telemetry_schema(user_id, mock_signals)
        telemetry_doc['date'] = date_str  # Use the historical date
        telemetry_col.insert_one(telemetry_doc)

        # Save to Mood Collection
        mood_score = 6 if i > 3 else 8 # Simulating mood improvement
        mood_doc = get_mood_schema(user_id, mood_score)
        mood_doc['timestamp'] = target_date
        mood_col.insert_one(mood_doc)

    print("📅 7 days of Telemetry and Mood logs generated.")

    # 3. Trigger the Prediction Logic
    # This calls your hardcoded run_prediction from models/predictor.py
    risk_score, status, forecast = run_prediction(user_id)
    
    # Save the result to the Prediction Collection for the Dashboard to find
    pred_doc = get_prediction_schema(user_id, risk_score, status, forecast)
    prediction_col.update_one({"user_id": user_id}, {"$set": pred_doc}, upsert=True)

    print(f"🧠 AI Prediction Processed: {risk_score}% Risk ({status})")
    print("\n✅ DATABASE SETUP COMPLETE. Refresh your dashboard now!")

if __name__ == "__main__":
    try:
        initialize_database()
    except Exception as e:
        print(f"❌ Database Error: {e}")
        print("Check if MongoDB is running: 'sudo systemctl status mongod'")