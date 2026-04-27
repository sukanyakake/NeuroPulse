from flask import Blueprint, jsonify
from datetime import datetime

from database.db_connection import prediction_col, mood_col, telemetry_col
from services.action_center_service import ActionCenterService
from utils.auth_utils import get_user_from_token  # ✅ JWT

dashboard_bp = Blueprint('dashboard', __name__)


# =========================
# 📅 GET TODAY DATE
# =========================     
def get_today():
    return datetime.now().strftime("%Y-%m-%d")


# =========================
# 📊 DASHBOARD SUMMARY
@dashboard_bp.route('/summary', methods=['GET'])
def get_dashboard_summary():
    try:
        user_id = get_user_from_token()
        if not user_id:
            return jsonify({"error": "Unauthorized"}), 401

        today = get_today()

        # =========================
        # 📊 TELEMETRY
        # =========================
        telemetry = telemetry_col.find_one(
            {"user_id": user_id, "date": today},
            sort=[("sync_at", -1)]
        )

        if not telemetry:
            return jsonify({
                "status": "No Data",
                "risk_score": 0,
                "forecast_72h": [],
                "reason": "No telemetry data for today",
                "signals": {},
                "mood_score": 3,
                "advice": []
            }), 200

        # =========================
        # 🤖 PREDICTION (FIX HERE)
        # =========================
        prediction = prediction_col.find_one({
            "user_id": user_id,
            "date": today
        })

        # 🔥 IF MISSING → GENERATE
        if not prediction:
            from models.predictor import run_prediction

            print("🔥 No prediction → generating...")

            try:
                result = run_prediction(user_id)
            except Exception as e:
                print("Prediction error:", e)
                result = {
                    "risk_score": 0,
                    "status": "No Data",
                    "forecast_72h": [],
                    "reason": "Prediction failed"
                }

            prediction = {
                "user_id": user_id,
                "date": today,
                "risk_score": result.get("risk_score", 0),
                "status": result.get("status", "No Data"),
                "forecast_72h": result.get("forecast_72h", []),
                "reason": result.get("reason", ""),
                "updated_at": datetime.now()
            }

            # ✅ SAVE BACK
            prediction_col.update_one(
                {"user_id": user_id, "date": today},
                {"$set": prediction},
                upsert=True
            )

        # =========================
        # 🙂 MOOD
        # =========================
        mood = mood_col.find_one({
            "user_id": user_id,
            "date": today
        })

        # =========================
        # ✨ ACTION CENTER
        # =========================
        action_data = ActionCenterService.get_recommendations(user_id)

        # =========================
        # ✅ RESPONSE
        # =========================
        return jsonify({
            "status": prediction.get("status", "No Data"),
            "risk_score": float(prediction.get("risk_score", 0)),
            "forecast_72h": prediction.get("forecast_72h", []),
            "reason": prediction.get("reason", ""),
            "signals": telemetry.get("metrics", {}),
            "mood_score": mood.get("mood_score", 3) if mood else 3,
            "advice": [step["title"] for step in action_data.get("steps", [])]
        }), 200

    except Exception as e:
        print("❌ DASHBOARD ERROR:", e)
        return jsonify({"error": str(e)}), 500