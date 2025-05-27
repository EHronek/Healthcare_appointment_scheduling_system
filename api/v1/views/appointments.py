#!/usr/bin/env python3
"""Defines endpoints for appointments CRUD processes"""
from models import storage
import models
from api.v1.views import app_views
from api.v1.helper_functions import role_required, is_doctor_available, validate_appointment_data
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.appointment import Appointment
from models.doctor import Doctor
from models.patient import Patient
from models.availability import Availability
from datetime import datetime, time, timedelta


@app_views.route("/appointments", methods=["POST"], strict_slashes=False)
@jwt_required()
@role_required('patient')
def create_appointment():
    """creates a new appointment"""
    sess = storage.get_session()
    current_user_id = get_jwt_identity()
    print("Current user: ", current_user_id)
    
    data = request.get_json(silent=True)

    # validate input
    errors = validate_appointment_data(data)
    if errors:
        return jsonify({"errors": errors}), 400
    
    try:
        scheduled_time = datetime.fromisoformat(data['scheduled_time'])
        duration = int(data['duration'])

        # Get Patient
        patient = sess.query(Patient).filter_by(user_id=current_user_id).first()
        print(patient.id)
        if not patient:
            return jsonify({"error": "patient profile not found"}), 404
        
        # check doctor exists
        doctor = storage.get(Doctor, data['doctor_id'])
        if not doctor:
            return jsonify({"error": "Doctor not found"})
        
        working_hours_start = datetime.strptime(data['start_time'], "%H:%M").time()
        working_hours_end = datetime.strptime(data['end_time'], "%H:%M").time()
        
        # check available
        is_available, reason = is_doctor_available(doctor.id,
                                           scheduled_time,
                                           duration,
                                           working_hours_start,
                                           working_hours_end
                        )
        
        if not is_available:
            return jsonify({"error": reason}), 409
        
        # create appointment
        new_appointment = Appointment(
            patient_id=patient.id,
            doctor_id=doctor.id,
            scheduled_time=scheduled_time,
            duration=timedelta(minutes=duration),
            status='scheduled'
        )

        try:
            storage.new(new_appointment)
            storage.save()
            return jsonify({
                "id": new_appointment.id,
            "message": "Appointment scheduled successfully",
            "details": {
                "doctor": f"Dr. {doctor.first_name} {doctor.last_name}",
                "time": scheduled_time.isoformat(),
                "duration": duration
            }
            }), 201
        except Exception as e:
            print("error when saving => ", e)
            return jsonify({"error": "Something went wrong while saving"})

    except Exception as e:
        
        return jsonify({"error": str(e)}), 500
        

