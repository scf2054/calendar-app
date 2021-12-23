from flask_restful import Resource

from flask_restful import request
from flask_restful import reqparse
import json
from .db.db_utils import *
from .constants import *

class Days(Resource):
    def get(self):
        return exec_get_all(f"SELECT * FROM {DAY_OF_WEEK};")

class Day(Resource):
    def get(self, id):
        return exec_get_all(f"SELECT * FROM {DAY_OF_WEEK} WHERE {ID} = {id};")