#!/usr/bin/python3
from flask_jwt_extended import get_jwt, get_jwt_identity, verify_jwt_in_request
from flask import jsonify
from functools import wraps
from flask_jwt_extended import create_access_token, create_refresh_token

def is_admin():
    """Helper to check if user has admin role for jwt"""
    claims = get_jwt()
    return claims.get('role') == 'admin'

def role_required(*allowed_roles):
    """Decorator to restrict access to users with specific role"""
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            user_role = claims.get('role')

            if user_role not in allowed_roles:
                print(user_role)
                print(allowed_roles)
                return jsonify({"msg": "Access denied: insufficient permissions"}), 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper


def generate_tokens_for_user(user):
    access_token = create_access_token(identity=str(user.id), additional_claims={'role': user.role})
    refresh_token = create_refresh_token(identity=str(user.id))
    return {
        "access_token": access_token,
        "refresh_token": refresh_token
    }
