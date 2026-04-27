import numpy as np
import random

from models.model_loader import model, scaler
from database.db_connection import telemetry_col, mood_col


# =========================
# 🔥 FETCH LAST AVAILABLE DAYS (MAX 7)
# =========================
def get_last_days(user_id):
    data = list(
        telemetry_col.find({"user_id": user_id})
        .sort([("date", -1), ("sync_at", -1)])
        .limit(7)
    )

    if not data:
        print("⚠️ No telemetry data found")
        return []

    data.reverse()

    days = []

    for d in data:
        metrics = d.get("metrics", {})

        mood_entry = mood_col.find_one(
            {"user_id": user_id, "date": d["date"]}
        )
        mood = mood_entry["mood_score"] if mood_entry else 3

        days.append({
            "screen_time": float(metrics.get("screen_time", 0)),
            "sleep": float(metrics.get("sleep", 0)),
            "steps": float(metrics.get("steps", 0)),
            "unlocks": float(metrics.get("unlocks", 0)),
            "mood": float(mood)
        })

    return days


# =========================
# 🔥 FEATURE ENGINEERING
# =========================
def build_features(day):
    screen = day["screen_time"]
    sleep = day["sleep"]
    steps = day["steps"]
    unlocks = day["unlocks"]
    mood = day["mood"]

    sleep_deficit = max(0, 8 - sleep)
    activity_score = steps / 10000
    screen_intensity = screen / 8
    mood_inversion = (5 - mood) * 2
    weekday_flag = 1
    late_night_flag = 1 if screen > 7 else 0

    return [
        screen, sleep, steps, unlocks, mood,
        sleep_deficit, activity_score,
        screen_intensity, mood_inversion,
        weekday_flag, late_night_flag
    ]


# =========================
# 🔥 RULE BASED RISK
# =========================
def calculate_rule_risk(day):
    score = (
        day["screen_time"] * 4 +
        max(0, (8 - day["sleep"])) * 10 +
        max(0, (10000 - day["steps"]) / 400) +
        (5 - day["mood"]) * 15
    )
    return max(0, min(100, score))


# =========================
# 🔥 REASON
# =========================
def generate_reason(day):
    reasons = []

    if day["sleep"] < 6:
        reasons.append("Poor sleep")
    if day["screen_time"] > 6:
        reasons.append("Excess screen usage")
    if day["steps"] < 5000:
        reasons.append("Low activity")
    if day["mood"] <= 3:
        reasons.append("Low mood")

    return ", ".join(reasons) if reasons else "Stable mental condition"


# =========================
# 🔥 BUILD SEQUENCE (FIXED)
# =========================
def build_sequence(days):

    # ✅ FIXED PADDING (front padding, not duplicate)
    while len(days) < 7:
        days.insert(0, {
            "screen_time": 0,
            "sleep": 7,
            "steps": 3000,
            "unlocks": 30,
            "mood": 3
        })

    seq = np.array([build_features(d) for d in days])

    if scaler is None:
        raise Exception("Scaler not loaded")

    seq = scaler.transform(seq)

    return seq.reshape(1, seq.shape[0], seq.shape[1])


# =========================
# 🔥 STATUS
# =========================
def get_status(risk):
    if risk < 40:
        return "Low Risk"
    elif risk < 70:
        return "Moderate Risk"
    return "High Risk"


# =========================
# 🔥 MAIN PREDICTION
# =========================
def run_prediction(user_id):

    try:
        print("MODEL:", model)
        print("SCALER:", scaler)

        if model is None or scaler is None:
            return {
                "risk_score": 50,
                "status": "Fallback",
                "forecast_72h": [52, 55, 58],
                "reason": "Model unavailable"
            }

        days = get_last_days(user_id)

        if not days:
            return {
                "risk_score": 0,
                "status": "No Data",
                "forecast_72h": [],
                "reason": "No telemetry data"
            }

        seq = build_sequence(days)

        # 🤖 LSTM prediction
        lstm_risk = float(model.predict(seq, verbose=0)[0][0])

        # ✅ FIX: USE REAL LAST DAY
        latest_day = next(
            (d for d in reversed(days) if d["screen_time"] > 0 or d["steps"] > 0),
            days[-1]
        )

        rule_risk = calculate_rule_risk(latest_day)

        # ✅ FIX: BETTER WEIGHTING
        risk =round(0.3*lstm_risk+0.7*rule_risk,2)

        # 🔍 DEBUG
        print("USER:", user_id)
        print("LSTM:", lstm_risk)
        print("RULE:", rule_risk)
        print("FINAL:", risk)
        print("LATEST DAY:", latest_day)

        # =========================
        # 🔮 FORECAST (STABLE)
        # =========================
        forecast = []
        temp_seq = seq.copy()

        for _ in range(3):
            next_lstm = float(model.predict(temp_seq, verbose=0)[0][0])

            new_scaled = temp_seq[0][-1].copy()

            # ✅ deterministic change (no randomness)
            new_scaled[0] = min(1, new_scaled[0] * 1.02)  # screen ↑
            new_scaled[1] = max(0, new_scaled[1] * 0.98)  # sleep ↓

            real = scaler.inverse_transform([new_scaled])[0]

            simulated_day = {
                "screen_time": real[0],
                "sleep": real[1],
                "steps": real[2],
                "unlocks": real[3],
                "mood": real[4]
            }

            rule_future = calculate_rule_risk(simulated_day)

            next_risk = round(0.3 * next_lstm + 0.7 * rule_future, 2)

            forecast.append(next_risk)

            temp_seq = np.append(temp_seq[:, 1:, :], [[new_scaled]], axis=1)

        return {
            "risk_score": risk,
            "status": get_status(risk),
            "forecast_72h": forecast,
            "reason": generate_reason(latest_day)
        }

    except Exception as e:
        print("❌ PRED ERROR:", str(e))
        return {
            "risk_score": 0,
            "status": "Error",
            "forecast_72h": [],
            "reason": str(e)
        }