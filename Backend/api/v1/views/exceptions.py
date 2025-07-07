#!/usr/bin/env python3
"""Endpoint for Exception"""
from models import storage
from flask import jsonify, request
from models.exception import Exception as Doctor_Exception
from models.doctor import Doctor
from api.v1.views import app_views
from flask_jwt_extended import get_jwt_identity, jwt_required
from api.v1.helper_functions import role_required



@app_views.route("/exceptions", methods=["GET"], strict_slashes=False)
@jwt_required()
def get_all_exceptions():
    """Gets all exceptions in the database"""
    exceptions = storage.all(Doctor_Exception).values()

    if not exceptions:
        return jsonify({"error": "exceptions not found"}), 404

    return jsonify([exception.to_dict() for exception in exceptions]), 200


@app_views.route('/exceptions/<string:exception_id>', methods=["GET"], strict_slashes=False)
@jwt_required()
def get_exception_data(exception_id):
    """Retrieves a specific exception data"""
    exception = storage.get(Doctor_Exception, exception_id)

    if not exception:
        return jsonify({"error": "exception not found"}), 404
    return jsonify(exception.to_dict()), 200


@app_views.route("/exceptions", methods=['POST'], strict_slashes=False)
@jwt_required()
def create_exception():
    """creates a new exception"""
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "invalid json"}), 400
    
    required_fields = ["doctor_id", "date", "is_available"]

    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"missing field '{field}'"}), 400
    
    # Check if is valid ID and Exists
    is_valid_id = storage.find(Doctor, data.get('doctor_id'))
    if not is_valid_id:
        return jsonify({"error": "doctor id is invalid"}), 400
    
    new_exception = Doctor_Exception(
        doctor_id=data.get('doctor_id'),
        date=data.get('date'),
        is_available=data.get('is_available')
    )
    try:
        storage.new(new_exception)
        storage.save()
        return jsonify(new_exception.to_dict()), 201
    except Exception as e:
        print(e)
        return jsonify({"error": f"Error saving => {e}"}), 500
    

@app_views.route('/exceptions/<string:exception_id>', methods=["PUT"], strict_slashes=False)
@jwt_required()
@role_required('admin', 'doctor')
def update_exception(exception_id):
    """updates a specific exception based on exception id"""
    exception = storage.get(Doctor_Exception, exception_id)

    if not exception:
        return jsonify({"error": "exception not found"}), 404

    new_data = request.get_json(silent=True)

    if not new_data:
        return jsonify({"error": "not a valid json"}), 400
    
    keys_to_ignore = {"id", "created_at", "updated_at"}

    for key, value in new_data.items():
        if key not in keys_to_ignore:
            setattr(exception, key, value)
    try:
        exception.save()
        return jsonify(exception.to_dict()), 200
    except Exception as e:
        print(e)
        return jsonify({"error": "problem saving data"}), 500


@app_views.route("/exceptions/<string:exception_id>", methods=['DELETE'], strict_slashes=False)
@jwt_required()
@role_required('admin', 'doctor')
def delete_exception(exception_id):
    """Deletes a specific exception from the database"""
    exception = storage.get(Doctor_Exception, exception_id)

    if not exception:
        return jsonify({"error": "exception not found"}), 404
    
    try:
        storage.delete(exception)
        storage.save()
        return jsonify({"message": "exception deleted successfully"})
    except Exception as e:
        print("error deleting exeption", e)
        return jsonify({"error": "Error deleting exception"})

