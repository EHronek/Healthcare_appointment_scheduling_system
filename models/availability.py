#!/usr/bin/python3
"""Defines the Availability Model"""
import models
from models.base_model import Base, BaseModel
from sqlalchemy import Column, String, Time, ForeignKey
from sqlalchemy.orm import relationship


class Availability(BaseModel, Base):
    """Defnes Availability Blueprint"""
    if models.storage_type == "db":
        __tablename__ = "availability"
        doctor_id = Column(String(60), ForeignKey('doctors.id'), nullable=False)
        day_of_week = Column(String(70), nullable=False)
        start_time = Column(Time, nullable=False)
        end_time = Column(Time, nullable=False)

        doctor = relationship('Doctor', back_populates='availability')

    else:
        doctor_id =""
        day_of_week = ""
        start_time = ""
        end_time = ""


    def __init__(self, *args, **kwargs):
        """Initializes the availability model"""
        super().__init__(*args, **kwargs)
