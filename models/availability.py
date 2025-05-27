#!/usr/bin/python3
"""Defines the Availability Model"""
import models
from models.base_model import Base, BaseModel
from sqlalchemy import Column, String, Time, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

time = "%Y-%m-%dT%H:%M:%S.%f"



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

    def to_dict(self):
        """
        Returns the dictionary containing all key-values of the current objects attributes
        """
        new_dict = self.__dict__.copy()
        if "created_at" in new_dict:
            new_dict["created_at"] = new_dict["created_at"].strftime(time)
        if "updated_at" in new_dict:
            new_dict["updated_at"] = new_dict["updated_at"].strftime(time)
        if "start_time" in new_dict:
            new_dict["start_time"] = new_dict["start_time"].strftime("%H:%M:%S")
        if "end_time" in new_dict:
            new_dict["end_time"] = new_dict["end_time"].strftime("%H:%M:%S")
        new_dict["__class__"] = self.__class__.__name__
        if "_sa_instance_state" in new_dict:
            del new_dict["_sa_instance_state"]
        return new_dict