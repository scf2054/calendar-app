from flask_restful import Resource

from flask_restful import request
from flask_restful import reqparse
import json
from .db.db_utils import *

class Events(Resource):
    def get(self):
        return exec_get_all("SELECT * FROM event_table")