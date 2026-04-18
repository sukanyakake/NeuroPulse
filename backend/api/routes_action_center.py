from flask import Blueprint, jsonify
from services.action_center_service import ActionCenterService
from utils.auth_utils import get_user_from_token

action_center_bp = Blueprint('action_center', __name__)


@action_center_bp.route('/plan', methods=['GET'])
def get_action_plan():

    user_id = get_user_from_token()

    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    data = ActionCenterService.get_recommendations(user_id)

    return jsonify(data), 200