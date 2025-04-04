#!/usr/bin/python3
"""Defines the Appointment class"""
import models
from models.base_model import Base, BaseModel
from sqlalchemy import Column, String, ForeignKey, DateTime, Time, Enum
from sqlalchemy.orm import relationship


class Appointment(BaseModel, Base):
    """Blueprint for Appointment model"""
    if models.storage_type == "db":
        __tablename__ = 'appointments'
        patient_id = Column(String(60), ForeignKey('patients.id'), nullable=False)
        doctor_id = Column(String(60), ForeignKey('doctors.id'), nullable=False)
        scheduled_time = Column(DateTime, nullable=False)
        duration = Column(Time, nullable=False)
        status = Column(Enum('scheduled', 'cancelled', 'completed', name='appointment_status'), default='scheduled', nullable=False)

        patient = relationship("Patient", back_populates='appointments')
        doctor = relationship("Doctor", back_populates='appointments')

    else:
        patient_id = ""
        doctor_id = ""
        scheduled_time = ""
        duration = ""
        status = ""

    def __init__(self, *args, **kwargs):
        """Initializes the Appointment instance"""
        super().__init__(*args, **kwargs)
