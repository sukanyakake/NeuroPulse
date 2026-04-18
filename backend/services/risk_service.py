from models.predictor import run_prediction


def get_risk(user_id):
    try:
        risk, status, forecast, reason = run_prediction(user_id)

        return {
            "risk_score": risk,
            "status": status,
            "forecast_72h": forecast,
            "reason": reason
        }

    except Exception as e:
        return {"error": str(e)}