from flask_restful import Resource

from flask_restful import request
from flask_restful import reqparse
import json
from .db.db_utils import *

class ExampleApi(Resource):
    def get(self):
    # NOTE: No need to replicate code; use the util function!
       result = exec_get_one("SELECT COUNT(*) FROM courses");
       return result

class TestMessage(Resource):
    def get(self):
        return "Modal components can use onOpened to fetch data dynamically!"