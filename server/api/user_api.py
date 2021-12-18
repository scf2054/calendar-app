from flask_restful import Resource

from flask_restful import request
from flask_restful import reqparse
import json

from .db.db_utils import *
from .constants import *
from .api_utils.post_utils import default_user

HELP_USERNAME = "Your username for the account."
HELP_USER_TYPE  = "Can be one of four: school, work, hybrid and other."

users_post_args = reqparse.RequestParser()
users_post_args.add_argument(USERNAME, type=str, help=HELP_USERNAME, required=True)
users_post_args.add_argument(USER_TYPE, type=str, help=HELP_USER_TYPE, required=False)

class Users(Resource):
    def get(self):
        return exec_get_all(f"SELECT * FROM {USER_TABLE}")

    def post(self):
        args = users_post_args.parse_args()
        username = args[USERNAME]
        user_type = args[USER_TYPE]
        if len(exec_get_all(f"SELECT * FROM {USER_TABLE} WHERE {USERNAME} = '{username}'")) != 0:
            if user_type != 'school' and user_type != 'work' and user_type != 'hybrid':
                user_type = 'other'
            exec_commit(f"INSERT INTO {USER_TABLE}({USERNAME}, {USER_TYPE}) VALUES ('{username}', '{user_type}'")
            return default_user(exec_get_one(f"SELECT * FROM {USER_TABLE} WHERE {USERNAME} = '{username}' and {USER_TYPE} = '{user_type}';")[0])
        else:
            return 403

class User(Resource):
    def get(self, id):
        return exec_get_all(f"SELECT * FROM user_table WHERE id = {id};")

    