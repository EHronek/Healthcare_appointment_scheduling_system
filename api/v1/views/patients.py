#!/usr/bin/python3
""" Endpoints for Patient """
from models import storage
from flask import jsonify, request
from models.patient import Patient
from api.v1.views import app_views


@app_views.route('/patients', methods=["GET"], strict_slashes=False)
def get_patients():
    """Retrieves all the patients from the database"""
    patients = storage.all(Patient).values()

    """ if not patients:
        return jsonify({"error", "not found"}), 404 """
    
    return jsonify([patient.to_dict() for patient in patients]), 200

@app_views.route("/patients/<patient_id>", methods=["GET"], strict_slashes=False)
def get_patient_by_id(patient_id):
    """Retrieves a specific patient by id"""
    patient = storage.get(Patient, patient_id)
    if not patient:
        return jsonify({"error": "not found"}), 404
    return jsonify(patient.to_dict()), 200