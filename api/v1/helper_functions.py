#!/usr/bin/python3
from flask_jwt_extended import get_jwt, get_jwt_identity, verify_jwt_in_request
from flask import jsonify
from functools import wraps

def is_admin():
    """Helper to check if user has admin role for jwt"""
    claims = get_jwt()
    return claims.get('role') == 'admin'

def role_required(*role):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            user = get_jwt_identity()
            if user["role"] not in ['admin', 'patient', 'doctor']:
                return jsonify({"msg": "Access denied"}), 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper
