from flask import Blueprint, request, jsonify
from datetime import datetime

from database.db_connection import telemetry_col, mood_col, prediction_col
from utils.auth_utils import get_user_from_token
from models.predictor import run_prediction

datasources_bp = Blueprint('datasources', __name__)


# =========================
# 📅 DATE
# =========================
def get_today():
    return datetime.now().strftime("%Y-%m-%d")


# =========================
# 🔥 SYNC API (FINAL FIX)
# =========================
@datasources_bp.route('/sync', methods=['POST'])
def sync_data():
    try:
        user_id = get_user_from_token()
        if not user_id:
            return jsonify({"error": "Unauthorized"}), 401

        data = request.get_json(force=True)

        signals = data.get("signals", None)
        mood_score = data.get("mood_score", None)

        print("🔥 RECEIVED:", signals, mood_score)

        # ❌ reject only if NOTHING is sent
        if signals is None and mood_score is None:
            return jsonify({"error": "No data provided"}), 400

        today = get_today()

        # =========================
        # 📊 TELEMETRY (ONLY IF PRESENT)
        # =========================
        if signals is not None:
            telemetry_doc = {
                "user_id": user_id,
                "date": today,
                "metrics": {
                    "screen_time": float(signals.get("screen_time", 0)),
                    "sleep": float(signals.get("sleep", 0)),
                    "steps": float(signals.get("steps", 0)),
                    "unlocks": float(signals.get("unlocks", 0)),
                },
                "sync_at": datetime.now()
            }

            telemetry_col.update_one(
                {"user_id": user_id, "date": today},
                {"$set": telemetry_doc},
                upsert=True
            )

        # =========================
        # 🙂 MOOD (ONLY IF PRESENT)
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
        # 🤖 PREDICTION (ONLY IF DATA EXISTS)
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

        prediction_col.update_one(
            {"user_id": user_id, "date": today},
            {"$set": prediction_doc},
            upsert=True
        )

        return jsonify({
            "message": "Synced successfully",
            "risk_score": prediction_doc["risk_score"]
        }), 200

    except Exception as e:
        print("❌ SYNC ERROR:", str(e))
        return jsonify({"error": str(e)}), 500
# =========================
# 📜 RAW LOGS
# =========================
@datasources_bp.route('/raw_logs', methods=['GET'])
def get_raw_logs():
    try:
        user_id = get_user_from_token()

        logs = list(
            telemetry_col.find({"user_id": user_id})
            .sort([("date", -1), ("sync_at", -1)])
        )

        for log in logs:
            log["_id"] = str(log["_id"])
            log["sync_at"] = str(log.get("sync_at"))

        return jsonify(logs)

    except Exception as e:
        print("❌ RAW LOG ERROR:", str(e))
        return jsonify({"error": str(e)}), 500


# =========================
# 📊 SUMMARY
# =========================
@datasources_bp.route('/summary', methods=['GET'])
def get_summary():
    try:
        user_id = get_user_from_token()
        today = get_today()

        telemetry = telemetry_col.find_one({
            "user_id": user_id,
            "date": today
        })

        mood = mood_col.find_one({
            "user_id": user_id,
            "date": today
        })

        # =========================
        # 🔥 ALWAYS GENERATE PREDICTION
        # =========================
        try:
            result = run_prediction(user_id)
        except Exception as e:
            print("⚠️ Prediction error:", e)
            result = {
                "risk_score": 0,
                "status": "No Data",
                "forecast_72h": [],
                "reason": "Prediction failed"
            }

        # =========================
        # 💾 SAVE IT (IMPORTANT)
        # =========================
        prediction_col.update_one(
            {"user_id": user_id, "date": today},
            {
                "$set": {
                    "user_id": user_id,
                    "date": today,
                    "risk_score": result.get("risk_score", 0),
                    "status": result.get("status", "No Data"),
                    "forecast_72h": result.get("forecast_72h", []),
                    "reason": result.get("reason", ""),
                    "updated_at": datetime.now()
                }
            },
            upsert=True
        )

        return jsonify({
            "date": today,
            "signals": telemetry.get("metrics", {}) if telemetry else {},
            "mood_score": mood.get("mood_score", 3) if mood else 3,
            "risk_score": result.get("risk_score", 0),
            "status": result.get("status", "No Data"),
            "forecast_72h": result.get("forecast_72h", []),
            "reason": result.get("reason", "")
        })

    except Exception as e:
        print("❌ SUMMARY ERROR:", str(e))
        return jsonify({"error": str(e)}), 500
