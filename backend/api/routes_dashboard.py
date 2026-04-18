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
# =========================
@dashboard_bp.route('/summary', methods=['GET'])
def get_dashboard_summary():
    try:
        # =========================
        # 🔐 GET USER FROM TOKEN
        # =========================
        user_id = get_user_from_token()

        if not user_id:
            return jsonify({"error": "Unauthorized"}), 401

        today = get_today()

        # =========================
        # 📊 TELEMETRY (LATEST TODAY)
        # =========================
        telemetry = telemetry_col.find_one(
            {"user_id": user_id, "date": today},
            sort=[("sync_at", -1)]
        )

        # =========================
        # 🚨 NO DATA CASE
        # =========================
        if not telemetry:
            return jsonify({
                "status": "No Data",
                "risk_score": 0,
                "forecast_72h": [],
                "reason": "No telemetry data for today",
                "signals": {
                    "screen_time": 0,
                    "sleep": 0,
                    "steps": 0,
                    "unlocks": 0
                },
                "mood_score": 3,
                "advice": []
            }), 200

        # =========================
        # 🤖 PREDICTION
        # =========================
        prediction = prediction_col.find_one(
            {"user_id": user_id, "date": today},
            sort=[("updated_at", -1)]
        )

        # =========================
        # 🙂 MOOD
        # =========================
        mood = mood_col.find_one(
            {"user_id": user_id, "date": today},
            sort=[("sync_at", -1)]
        )

        # =========================
        # ✨ ACTION CENTER
        # =========================
        action_data = ActionCenterService.get_recommendations(user_id)

        # =========================
        # ✅ FINAL RESPONSE
        # =========================
        return jsonify({
            "status": prediction["status"] if prediction else "No Data",
            "risk_score": float(prediction["risk_score"]) if prediction else 0,
            "forecast_72h": prediction["forecast_72h"] if prediction else [],
            "reason": prediction.get("reason") if prediction else "",
            "signals": telemetry.get("metrics", {}),
            "mood_score": mood.get("mood_score", 3) if mood else 3,
            "advice": [step["title"] for step in action_data.get("steps", [])]
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500