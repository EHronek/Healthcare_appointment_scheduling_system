#!/usr/bin/python3
"""Defines the Exception Model"""
from models.base_model import Base, BaseModel
import models
from sqlalchemy import ForeignKey, Column, String, Date, Boolean
from sqlalchemy.orm import relationship


class Exception(BaseModel, Base):
    """Defines the Blueprint for the Exception Model"""
    if models.storage_type == "db":
        __tablename__ = 'exceptions'
        doctor_id = Column(String(60), ForeignKey('doctors.id'), nullable=False)
        date = Column(Date, nullable=False)
        is_available = Column(Boolean, default=True)

        doctor = relationship('Doctor', back_populates='exceptions')

    else:
        doctor_id = ""
        date = ""
        is_available = True

    def __init__(self, *args, **kwargs):
        """Initializes the Exception"""
        super().__init__(*args, **kwargs)
