#!/usr/bin/python3
"""Checks the status of our api"""
from api.v1.views import app_views
from flask import jsonify
from models import storage
from models.user import User
from models.doctor import Doctor
from models.patient import Patient
from models.appointment import Appointment


@app_views.route('/status', methods=["GET"], strict_slashes=False)
def status():
    """Return the status of the api"""
    return jsonify({"status": "OK"})


@app_views.route('/stats', methods=['GET'], strict_slashes=False)
def stats():
    """Retrieves the number of each objects by type"""
    stats_data = {
        "users": storage.count(User),
        "doctors": storage.count(Doctor),
        "patients": storage.count(Patient),
        "appointments": storage.count(Appointment)
    }
    return jsonify(stats_data), 200
