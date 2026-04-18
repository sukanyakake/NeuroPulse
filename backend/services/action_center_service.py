from datetime import datetime
from database.db_connection import telemetry_col, mood_col, prediction_col


class ActionCenterService:

    @staticmethod
    def get_recommendations(user_id):
        try:
            today = datetime.now().strftime("%Y-%m-%d")

            print("🔍 CHECKING FOR:", user_id, today)

            # =========================
            # ✅ GET LATEST TELEMETRY
            # =========================
            telemetry = telemetry_col.find_one(
                {
                    "user_id": user_id,
                    "date": today
                },
                sort=[("sync_at", -1)]
            )

            mood = mood_col.find_one(
                {
                    "user_id": user_id,
                    "date": today
                },
                sort=[("timestamp", -1)]
            )

            prediction = prediction_col.find_one(
                {
                    "user_id": user_id,
                    "date": today
                },
                sort=[("updated_at", -1)]
            )

            print("📊 TELEMETRY FOUND:", telemetry)

            # =========================
            # 🚨 NO DATA
            # =========================
            if not telemetry:
                return {
                    "status": "no_data",
                    "observations": [],
                    "steps": [],
                    "prediction_improvement": "No data available",
                    "reason": "No telemetry data for today"
                }

            # =========================
            # ✅ EXTRACT DATA
            # =========================
            signals = telemetry.get("metrics", {})

            screen = signals.get("screen_time", 0)
            steps = signals.get("steps", 0)
            sleep = signals.get("sleep", 0)

            mood_score = mood.get("mood_score", 3) if mood else 3
            risk = prediction.get("risk_score", 0) if prediction else 0

            observations = []
            steps_plan = []
            reduction = 0
            idx = 1

            # =========================
            # 📱 SCREEN (IMPROVED RULE)
            # =========================
            if screen >= 5:
                observations.append({
                    "id": idx,
                    "type": "Digital",
                    "title": "High Screen Time",
                    "desc": f"You used your phone for {screen} hours today."
                })
                steps_plan.append({
                    "id": idx,
                    "title": "Reduce screen exposure before sleep",
                    "desc": "Avoid screens at least 30 mins before bed."
                })
                reduction += 5
                idx += 1

            # =========================
            # 😴 SLEEP (IMPROVED RULE)
            # =========================
            if sleep <= 7:
                observations.append({
                    "id": idx,
                    "type": "Sleep",
                    "title": "Sleep Could Improve",
                    "desc": f"You slept {sleep} hours today."
                })
                steps_plan.append({
                    "id": idx,
                    "title": "Improve sleep duration",
                    "desc": "Aim for 7–8 hours of consistent sleep."
                })
                reduction += 8
                idx += 1

            # =========================
            # 🚶 STEPS (IMPROVED RULE)
            # =========================
            if steps < 7000:
                observations.append({
                    "id": idx,
                    "type": "Activity",
                    "title": "Low Physical Activity",
                    "desc": f"You walked {steps} steps today."
                })
                steps_plan.append({
                    "id": idx,
                    "title": "Increase movement",
                    "desc": "Take a 15–20 minute walk."
                })
                reduction += 6
                idx += 1

            # =========================
            # 🙂 MOOD
            # =========================
            if mood_score <= 2:
                observations.append({
                    "id": idx,
                    "type": "Mood",
                    "title": "Low Mood Detected",
                    "desc": "Your mood score is low today."
                })
                steps_plan.append({
                    "id": idx,
                    "title": "Relax & connect",
                    "desc": "Talk to someone or take a mental break."
                })
                reduction += 7
                idx += 1

            # =========================
            # 🧠 DEFAULT FALLBACK (IMPORTANT)
            # =========================
            if not observations:
                observations.append({
                    "id": idx,
                    "type": "General",
                    "title": "Stable Day",
                    "desc": "Your daily habits look balanced. Keep it consistent!"
                })

            if not steps_plan:
                steps_plan.append({
                    "id": idx,
                    "title": "Maintain your routine",
                    "desc": "You're doing well. Keep following your current habits."
                })

            # =========================
            # 🔮 IMPROVEMENT
            # =========================
            if reduction == 0:
                improvement = "You're already doing great 🎉"
            elif risk > 0:
                improvement = f"-{min(reduction, 25)}% Risk Reduction"
            else:
                improvement = "No prediction yet"

            # =========================
            # ✅ FINAL RESPONSE
            # =========================
            return {
                "status": "success",
                "observations": observations,
                "steps": steps_plan,
                "prediction_improvement": improvement,
                "reason": prediction.get("reason", "Based on your behavior today") if prediction else "Based on your behavior today"
            }

        except Exception as e:
            print("❌ Action Center Error:", str(e))
            return {
                "status": "error",
                "observations": [],
                "steps": [],
                "prediction_improvement": "Error generating plan",
                "reason": "System error"
            }