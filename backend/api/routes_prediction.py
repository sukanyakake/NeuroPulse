from flask import Blueprint, jsonify
from datetime import datetime

from services.risk_service import get_risk
from utils.auth_utils import get_user_from_token
from database.db_connection import prediction_col  # ✅ ADD THIS

prediction_bp = Blueprint('prediction', __name__)


def get_today():
    return datetime.now().strftime("%Y-%m-%d")


@prediction_bp.route('/forecast', methods=['GET'])
def get_prediction_forecast():
    try:
        # 🔐 USER
        user_id = get_user_from_token()

        if not user_id:
            return jsonify({"error": "Unauthorized"}), 401

        today = get_today()

        # =========================
        # 🤖 RUN PREDICTION ALWAYS
        # =========================
        result = get_risk(user_id)

        if "error" in result:
            return jsonify(result), 400

        # =========================
        # 💾 UPSERT INTO DB
        # =========================
        prediction_doc = {
            "user_id": user_id,
            "date": today,
            "risk_score": float(result.get("risk_score", 0)),
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

        # =========================
        # ✅ RESPONSE
        # =========================
        return jsonify({
            "risk_score": prediction_doc["risk_score"],
            "status": prediction_doc["status"],
            "forecast_72h": [
                float(x) for x in prediction_doc["forecast_72h"]
            ],
            "reason": prediction_doc["reason"]
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500