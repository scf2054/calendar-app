from flask_restful import Resource

from flask_restful import request
from flask_restful import reqparse
import json
from .db.db_utils import *
from .constants import *

class Events(Resource):
    def get(self):
        return exec_get_all(f"SELECT * FROM {EVENT_TABLE};")

class Event(Resource):
    def get(self, id):
        return exec_get_one(f"SELECT * FROM {EVENT_TABLE} WHERE {ID} = {id};")

class User_Events(Resource):
    def get(self, u_id):
        return exec_get_all(f"SELECT * FROM {EVENT_TABLE} WHERE {U_ID} = {u_id};")