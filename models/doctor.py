#!/usr/bin/python3
"""Defines the Doctor Model"""
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from models.base_model import Base, BaseModel
import models


class Doctor(BaseModel, Base):
    """Blueprint for doctor"""
    if models.storage_type == "db":
        first_name = Column(String(128), nullable=False)
        last_name = Column(String(128), nullable=False)
        email = Column(String(128), unique=True, nullable=False)
        specialization = Column(String(128), nullable=False)
        user_id = Column(String(60), ForeignKey('users.id'), nullable=False)

        user = relationship('User', back_populates='doctors')
        appointments = relationship('Appointment', back_populates='doctor')
        availability = relationship('Availability', back_populates="doctor")
        exceptions = relationship('Exception', back_populates='doctor')
        medical_records= relationship('MedicalRecord', back_populates='doctor')

    
    else:
        first_name = ""
        last_name = ""
        email = ""
        specialization = ""
        user_id = ""

    def __init__(self, *args, **kwargs):
        """Initializes the Doctor instance"""
        super().__init__(*args, **kwargs)
