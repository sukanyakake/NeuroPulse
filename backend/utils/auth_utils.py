import jwt
from flask import request

# 🔥 IMPORTANT: SAME KEY AS LOGIN
SECRET_KEY = "neuropulse"


def get_user_from_token():
    try:
        # =========================
        # 🔐 GET AUTH HEADER
        # =========================
        auth_header = request.headers.get("Authorization")
        print("AUTH HEADER:", auth_header)

        if not auth_header:
            print("❌ No Authorization header")
            return None

        # =========================
        # 🔥 SPLIT TOKEN
        # =========================
        parts = auth_header.split(" ")

        if len(parts) != 2 or parts[0] != "Bearer":
            print("❌ Invalid token format")
            return None

        token = parts[1]

        # =========================
        # 🔓 DECODE TOKEN
        # =========================
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])

        user_id = decoded.get("user_id")

        print("✅ DECODED USER:", user_id)  # 🔥 DEBUG

        return user_id

    except jwt.ExpiredSignatureError:
        print("❌ Token expired")
        return None

    except jwt.InvalidTokenError:
        print("❌ Invalid token")
        return None

    except Exception as e:
        print("❌ Token error:", str(e))
        return None