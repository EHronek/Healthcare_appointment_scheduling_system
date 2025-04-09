#!/usr/bin/python3
from flask_jwt_extended import get_jwt

def is_admin():
    """Helper to check if user has admin role for jwt"""
    claims = get_jwt()
    return claims.get('role') == 'admin'
