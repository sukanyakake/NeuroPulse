from flask import Blueprint, request, jsonify
from datetime import datetime

from database.db_connection import telemetry_col, mood_col, prediction_col
from utils.auth_utils import get_user_from_token  # ✅ JWT
from models.predictor import run_prediction       # ✅ ADD THIS

datasources_bp = Blueprint('datasources', __name__)


# =========================
# 📅 GET TODAY DATE
# =========================
def get_today():
    return datetime.now().strftime("%Y-%m-%d")


# =========================
# 🔥 SYNC API (UPSERT + PREDICTION)
# =========================
@datasources_bp.route('/sync', methods=['POST'])
def sync_data():
    try:
        # 🔐 USER FROM TOKEN
        user_id = get_user_from_token()
        if not user_id:
            return jsonify({"error": "Unauthorized"}), 401

        # 📥 INPUT
        data = request.get_json(force=True)
        if not data:
            return jsonify({"error": "No JSON received"}), 400

        signals = data.get("signals")
        if not signals:
            return jsonify({"error": "signals missing"}), 400

        # ✅ ADD THIS LINE
        mood_score = data.get("mood_score")

        today = get_today()

        # =========================
        # 📦 SAVE TELEMETRY (UPSERT)
        # =========================
        telemetry_doc = {
            "user_id": user_id,
            "date": today,
            "metrics": {
                "screen_time": signals.get("screen_time", 0),
                "unlocks": signals.get("unlocks", 0),
                "steps": signals.get("steps", 0),
                "sleep": signals.get("sleep", 0)
            },
            "sync_at": datetime.now()
        }

        telemetry_col.update_one(
            {"user_id": user_id, "date": today},
            {"$set": telemetry_doc},
            upsert=True
        )

        # =========================
        # 🙂 SAVE MOOD (NEW - MINIMAL ADD)
        # =========================
        if mood_score is not None:
            mood_doc = {
                "user_id": user_id,
                "date": today,
                "mood_score": int(mood_score),
                "timestamp": datetime.now()
            }

            mood_col.update_one(
                {"user_id": user_id, "date": today},
                {"$set": mood_doc},
                upsert=True
            )

        # =========================
        # 🤖 RUN PREDICTION
        # =========================
        result = run_prediction(user_id)

        # =========================
        # 💾 SAVE PREDICTION (UPSERT)
        # =========================
        prediction_doc = {
            "user_id": user_id,
            "date": today,
            "risk_score": result.get("risk_score", 0),
            "status": result.get("status", "No Data"),
            "forecast_72h": result.get("forecast_72h", []),
            "reason": result.get("reason", ""),
            "updated_at": datetime.now()
        }

        prediction_col.update_one(
            {"user_id": user_id, "date": today},
            {"$set": prediction_doc},
            upsert=True
        )

        return jsonify({
            "message": "Sync + Prediction updated",
            "risk_score": prediction_doc["risk_score"]
        }), 200

    except Exception as e:
        print("SYNC ERROR:", str(e))
        return jsonify({"error": str(e)}), 500
# =========================
# 📜 RAW LOGS (HISTORY)
# =========================
@datasources_bp.route('/raw_logs', methods=['GET'])
def get_raw_logs():
    try:
        user_id = get_user_from_token()
        if not user_id:
            return jsonify({"error": "Unauthorized"}), 401

        logs = list(
            telemetry_col.find({"user_id": user_id})
            .sort("sync_at", -1)  # latest first
            .limit(20)
        )

        for log in logs:
            log["_id"] = str(log["_id"])

        return jsonify(logs), 200

    except Exception as e:
        print("RAW LOG ERROR:", str(e))
        return jsonify({"error": str(e)}), 500


# =========================
# 📊 SUMMARY (STRICT TODAY)
# =========================
@datasources_bp.route('/summary', methods=['GET'])
def get_summary():
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
                "date": today,
                "signals": {
                    "screen_time": 0,
                    "steps": 0,
                    "sleep": 0,
                    "unlocks": 0
                },
                "mood_score": 3,
                "risk_score": 0,
                "status": "No Data",
                "forecast_72h": [],
                "reason": "No telemetry data for today"
            }), 200

        # =========================
        # 🔥 ALWAYS RUN PREDICTION
        # =========================
        result = run_prediction(user_id)

        prediction_doc = {
            "user_id": user_id,
            "date": today,
            "risk_score": result.get("risk_score", 0),
            "status": result.get("status", "No Data"),
            "forecast_72h": result.get("forecast_72h", []),
            "reason": result.get("reason", ""),
            "updated_at": datetime.now()
        }

        # =========================
        # ✅ UPSERT (CREATE OR UPDATE)
        # =========================
        prediction_col.update_one(
            {"user_id": user_id, "date": today},
            {"$set": prediction_doc},
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
        # ✅ FINAL RESPONSE
        # =========================
        return jsonify({
            "date": today,
            "signals": telemetry.get("metrics", {}),
            "mood_score": mood.get("mood_score", 3) if mood else 3,
            "risk_score": float(prediction_doc["risk_score"]),
            "status": prediction_doc["status"],
            "forecast_72h": prediction_doc["forecast_72h"],
            "reason": prediction_doc["reason"]
        }), 200

    except Exception as e:
        print("SUMMARY ERROR:", str(e))
        return jsonify({"error": str(e)}), 500