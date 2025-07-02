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
from models.user import User
from models.exception import Exception as Doctor_Exception


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
        
        day_of_week = scheduled_time.strftime("%A")
        # print(day_of_week)
        time_available = sess.query(Availability).filter(Availability.doctor_id==doctor.id,
                                                            Availability.day_of_week==day_of_week).first()

        if not time_available:
            return jsonify({"error": "Availability and day not found"}), 400

        working_hours_start = time_available.start_time
        working_hours_end = time_available.end_time

        #working_hours_start = datetime.strptime(data['start_time'], "%H:%M").time()
        #working_hours_end = datetime.strptime(data['end_time'], "%H:%M").time()
        
        # check available
        is_available, reason = is_doctor_available(doctor.id,
                                           scheduled_time,
                                           duration,
                                           working_hours_start,
                                           working_hours_end,
                                           appointment_id_to_ignore=None
                        )
        
        if not is_available:
            return jsonify({"error": reason}), 409
        
        # create appointment
        new_appointment = Appointment(
            patient_id=patient.id,
            doctor_id=doctor.id,
            scheduled_time=scheduled_time,
            duration=duration,
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
        
@app_views.route("/appointments/<string:appointment_id>", methods=["GET"], strict_slashes=False)
@jwt_required()
@role_required('admin', 'doctor', 'patient')
def get_appointment(appointment_id):
    """Retrieves a specific appointment record from db"""
    sess = storage.get_session()
    appointment = storage.get(Appointment, appointment_id)

    if not appointment:
        return jsonify({"error": "appointment not found"}), 404
    
    current_user_id = get_jwt_identity()

    # Check if user is patient
    user = storage.get(User, current_user_id)

    if not user:
        return jsonify({"error": "user not found"}), 404
    
    role = user.role

    if role == 'patient':
        patient = sess.query(Patient).filter(Patient.user_id == current_user_id).first()
        if not patient or appointment.patient_id != patient.id:
            return jsonify({"error": "Unauthorized"}), 403
    elif role == "doctor":
        doctor = sess.query(Doctor).filter(Doctor.user_id == current_user_id).first()
        if not doctor or appointment.doctor_id != current_user_id:
            return jsonify({"error": "Unauthorized"}), 403

    return jsonify({
        "id": appointment.id,
        "patient_id": appointment.patient_id,
        "doctor_id": appointment.doctor_id,
        "scheduled_time": appointment.scheduled_time.isoformat(),
        "duration": appointment.duration,
        "status": appointment.status

    }), 200


@app_views.route("/appointments", methods=["GET"], strict_slashes=False)
@jwt_required()
def get_appointments():
    """Get all appointments"""
    current_user_id = get_jwt_identity()
    current_user = storage.get(User, current_user_id)
    
    if not current_user:
        return jsonify({"error": "Unauthorized"}), 401
    
    appointments = storage.all(Appointment).values()

    if not appointments:
        return jsonify({"error": "appointments not found"}), 404
    
    return jsonify([appointment.to_dict() for appointment in appointments]), 200


@app_views.route("/appointments/<string:appointment_id>/cancel", methods=["PUT"], strict_slashes=False)
@jwt_required()
@role_required('doctor', 'patient')
def cancel_appointment(appointment_id):
    """Cancels a specific appointment record"""
    sess = storage.get_session()
    appointment = storage.get(Appointment, appointment_id)

    if not appointment:
        return jsonify({"error": "appointment not found"}), 404
    current_user_id = get_jwt_identity()

    current_user = storage.get(User, current_user_id)

    if not current_user:
        return jsonify({"error": "user not found"}), 400
    
    user_role = current_user.role

    # authorization
    if user_role == 'patient':
        patient = sess.query(Patient).filter(Patient.user_id==current_user_id).first()
        if not patient or appointment.patient_id != patient.id:
            return jsonify({"error": "Unauthorized"}), 401
    elif user_role == 'doctor':
        doctor = sess.query(Doctor).filter(Doctor.user_id==current_user_id).first()
        if not doctor or appointment.doctor_id != doctor.id:
            return jsonify({"error": "Unauthorized"}), 401

    # Business rules
    time_until_appointment = appointment.scheduled_time - datetime.now()

    # cant  cancel completed appointments
    if appointment.status == "completed":
        return jsonify({"error": "Cannot cancel completed appointments"}), 400
    
    # minimum 24 hr notice for cancellation
    if time_until_appointment < timedelta(hours=24):
        return jsonify({ "error": "Cancellation requires at least 24 hours notice",
            "deadline": (appointment.scheduled_time - timedelta(hours=24)).isoformat()
        }), 400
    
    appointment.status = 'cancelled'

    # commit changes
    try:
        storage.save()
        return  jsonify({"message": "Appointment cancelled successfully"}), 200
    except Exception as e:
        return jsonify({"error": "error while saving"}), 500    

@app_views.route('appointments/<string:appointment_id>/complete', methods=["PUT"], strict_slashes=False)
@jwt_required()
@role_required('doctor')
def complete_appointment(appointment_id):
    appointment = storage.get(Appointment, appointment_id)

    if not appointment:
        return jsonify({"error": "appointment not found"}), 404
    
    current_user_id = get_jwt_identity()
    current_user = storage.get(User, current_user_id)

    if current_user.role != 'doctor':
        return jsonify({"error": "Unauthorized user"}), 401
    
    sess = storage.get_session()
    doctor = sess.query(Doctor).filter_by(user_id=current_user_id).first()

    if not doctor:
        return jsonify({"error": "user not found"}), 404

    # Authorization - only attending doctor can complete
    if appointment.doctor_id != doctor.id:
        return jsonify({"error": "Unauthorized"}), 403
    
    # Can only complete scheduled appointments
    if appointment.status != 'scheduled':
        return jsonify({"error": f"Cannot complete {appointment.status} appointment"}), 400
    
    # can't complete future appointments
    if appointment.scheduled_time > datetime.now():
        return jsonify({"error": "Cannot complete future appointments"}), 400
    
    appointment.status = 'completed'

    storage.save()

    return jsonify({"message": "Appointment marked as completed"}), 200


@app_views.route('/appointments/available_slots', methods=['GET'], strict_slashes=False)
@jwt_required()
def get_available_slots():
    sess = storage.get_session()
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "not a json"}), 400
    
    doctor_id = data.get('doctor_id', None)
    date = data.get('date', None)
    
    if not doctor_id or not date:
        return jsonify({"error": "doctor_id and date parameters required"}), 400
    
    try:
         target_date = datetime.strptime(date, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({"error": "Invalid date format (use YYYY-MM-DD)"}), 400
    
    # Get doctor's availability for this day
    day_of_week = target_date.strftime('%A')
    availability = sess.query(Availability).filter_by(
        doctor_id=doctor_id,
        day_of_week=day_of_week
    ).all()

    # check for exceptions
    exception = sess.query(Doctor_Exception).filter_by(
        doctor_id=doctor_id,
        date=target_date
    ).first()

    if exception and not exception.is_available:
        return jsonify({"available": False, "reason": "Doctor unavailable on this date"}), 200
    
    # Get booked slots
    start_of_day = datetime.combine(target_date, datetime.min.time())
    end_of_day = datetime.combine(target_date, datetime.max.time())
    
    booked_slots = sess.query(Appointment).filter(
        Appointment.doctor_id == doctor_id,
        Appointment.status == 'scheduled',
        Appointment.scheduled_time.between(start_of_day, end_of_day)
    ).all()
    
    
    # Generate available slots (30-minute intervals)
    available_slots = []
    for avail in availability:
        current_time = datetime.combine(target_date, avail.start_time)
        end_time = datetime.combine(target_date, avail.end_time)
        
        while current_time + timedelta(minutes=30) <= end_time:
            slot_end = current_time + timedelta(minutes=30)
            
            # Check if slot is booked
            is_booked = any(
                a.scheduled_time < slot_end and 
                a.scheduled_time + timedelta(a.duration) > current_time
                for a in booked_slots
            )
            
            if not is_booked and current_time > datetime.now():
                available_slots.append({
                    "start": current_time.isoformat(),
                    "end": slot_end.isoformat()
                })
            
            current_time += timedelta(minutes=30)
    
    return jsonify({
        "date": date,
        "doctor_id": doctor_id,
        "available_slots": available_slots
    })
