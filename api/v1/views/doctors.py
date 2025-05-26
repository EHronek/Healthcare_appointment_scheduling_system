#!/usr/bin/env python3
"""Endpoint for Doctor"""
from models import storage
from flask import jsonify, request
from models.doctor import Doctor
from api.v1.views import app_views
from flask_jwt_extended import get_jwt_identity, jwt_required
from api.v1.helper_functions import role_required
import re


@app_views.route('/doctors', methods=["GET"], strict_slashes=False)
@jwt_required()
@role_required('admin')
def get_all_doctors():
    """Retrieves all doctors data from db"""
    doctors = storage.all(Doctor).values()

    if not doctors:
        return jsonify({"error": "not found"}), 400
    return jsonify([doc.to_dict() for doc in doctors]), 200

