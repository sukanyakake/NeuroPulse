import jwt
import os
from flask import request
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")


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
        # 🔥 REMOVE "Bearer "
        # =========================
        parts = auth_header.split(" ")

        if len(parts) != 2:
            print("❌ Invalid token format")
            return None

        token = parts[1]

        # =========================
        # 🔓 DECODE TOKEN
        # =========================
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])

        return decoded.get("user_id")

    except jwt.ExpiredSignatureError:
        print("❌ Token expired")
        return None

    except jwt.InvalidTokenError:
        print("❌ Invalid token")
        return None

    except Exception as e:
        print("❌ Token error:", str(e))
        return None