from database.db_connection import telemetry_col, mood_col
from datetime import datetime, timedelta
import numpy as np


class BehaviourService:

    @staticmethod
    def get_detailed_stats(user_id="sukanya_kake"):
        try:
            today = datetime.now()

            # =========================
            # 📅 LAST 7 DAYS
            # =========================
            last_7_days = [
                (today - timedelta(days=i)).strftime("%Y-%m-%d")
                for i in range(6, -1, -1)
            ]

            screen_data = []
            sleep_data = []
            mood_data = []

            max_screen = 1
            max_sleep = 1
            max_mood = 1

            # =========================
            # 🔍 FETCH DATA
            # =========================
            for day in last_7_days:

                telemetry = telemetry_col.find_one({
                    "user_id": user_id,
                    "date": day
                })

                mood = mood_col.find_one({
                    "user_id": user_id,
                    "date": day
                })

                screen = (
                    telemetry.get("metrics", {}).get("screen_time", 0)
                    if telemetry else 0
                )

                sleep = (
                    telemetry.get("metrics", {}).get("sleep", 0)
                    if telemetry else 0
                )

                mood_val = (
                    mood.get("mood_score", 0)
                    if mood else 0
                )

                max_screen = max(max_screen, screen)
                max_sleep = max(max_sleep, sleep)
                max_mood = max(max_mood, mood_val)

                screen_data.append({
                    "day": day[-2:],
                    "value": round(screen, 1)
                })

                sleep_data.append({
                    "day": day[-2:],
                    "value": round(sleep, 1)
                })

                mood_data.append({
                    "day": day[-2:],
                    "value": mood_val
                })

            # =========================
            # 📊 NORMALIZATION
            # =========================
            for d in screen_data:
                d["percentage"] = (d["value"] / max_screen) * 100

            for d in sleep_data:
                d["percentage"] = (d["value"] / max_sleep) * 100

            for d in mood_data:
                d["percentage"] = (d["value"] / max_mood) * 100

            # =========================
            # 📊 CORRELATION MATRIX
            # =========================
            screen_vals = [d["value"] for d in screen_data]
            sleep_vals = [d["value"] for d in sleep_data]
            mood_vals = [d["value"] for d in mood_data]

            def safe_corr(a, b):
                if len(a) < 2:
                    return 0
                return round(float(np.corrcoef(a, b)[0, 1]), 2)

            correlation_matrix = [
                [
                    1,
                    safe_corr(screen_vals, sleep_vals),
                    safe_corr(screen_vals, mood_vals),
                ],
                [
                    safe_corr(sleep_vals, screen_vals),
                    1,
                    safe_corr(sleep_vals, mood_vals),
                ],
                [
                    safe_corr(mood_vals, screen_vals),
                    safe_corr(mood_vals, sleep_vals),
                    1,
                ],
            ]

            # =========================
            # 📤 FINAL RESPONSE
            # =========================
            return {
                "screen": screen_data,
                "sleep": sleep_data,
                "mood": mood_data,
                "correlation_matrix": correlation_matrix
            }

        except Exception as e:
            print("❌ Behaviour Service Error:", str(e))

            return {
                "screen": [],
                "sleep": [],
                "mood": [],
                "correlation_matrix": []
            }