from flask_restful import Resource

from flask_restful import request
from flask_restful import reqparse
import json
from .db.db_utils import *

class Users(Resource):
    def get(self):
        return exec_get_all("SELECT * FROM user_table")

class Events(Resource):
    def get(self):
    # NOTE: No need to replicate code; use the util function!
       return exec_get_all("SELECT * FROM event_table")

class Calendars(Resource):
    def get(self):
        return exec_get_all("SELECT * FROM calendar_table")