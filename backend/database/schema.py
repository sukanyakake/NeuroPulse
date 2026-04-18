from datetime import datetime
import uuid

# =========================
# 📊 TELEMETRY (PER DAY)
# =========================
def get_telemetry_schema(user_id, signals):
    return {
        "user_id": user_id,
        "date": datetime.now().strftime("%Y-%m-%d"),  # ✅ IMPORTANT
        "metrics": {
            "screen_time": float(signals.get('screen_time', 0)),
            "unlocks": int(signals.get('unlocks', 0)),
            "steps": int(signals.get('steps', 0)),
            "sleep": float(signals.get('sleep', 0))
        },
        "sync_at": datetime.now()
    }


# =========================
# 🙂 MOOD (PER DAY)
# =========================
def get_mood_schema(user_id, mood_score):
    return {
        "user_id": user_id,
        "date": datetime.now().strftime("%Y-%m-%d"),  # ✅ ADD THIS
        "mood_score": int(mood_score),
        "sync_at": datetime.now()
    }


# =========================
# 🤖 PREDICTION (PER DAY)
# =========================
def get_prediction_schema(user_id, risk_score, status, forecast, reason):
    return {
        "user_id": user_id,
        "date": datetime.now().strftime("%Y-%m-%d"),  # ✅ ADD THIS
        "risk_score": float(risk_score),              # ✅ FIX NUMPY ERROR
        "status": status,
        "forecast_72h": [float(x) for x in forecast], # ✅ SAFE CONVERSION
        "reason": reason,
        "updated_at": datetime.now()
    }


# =========================
# 👤 USER
# =========================
def user_schema(email, password):
    return {
        "user_id": str(uuid.uuid4()),  # ✅ UNIQUE ID
        "email": email.lower(),
        "password": password,
        "created_at": datetime.now()
    }