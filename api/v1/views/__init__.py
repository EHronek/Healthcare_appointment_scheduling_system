#!/usr/bin/python3
"""Initializes a blueprint instance and loads all the routes from the index"""
from flask import Blueprint

app_views = Blueprint("app_views", __name__, url_prefix="/api/v1")

from api.v1.views.index import *
from api.v1.views.users import *
from api.v1.views.patients import *
from api.v1.views.doctors import *
from api.v1.views.exceptions import *
from api.v1.views.availabilities import *
from api.v1.views.appointments import *
from api.v1.views.medical_records import *
