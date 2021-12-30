from flask_restful import Resource

from flask_restful import request
from flask_restful import reqparse
import json

from .db.db_utils import *
from .constants import *
from .api_utils.post_utils import default_user_calendar

HELP_USERNAME = "Your username for the account."
HELP_USER_TYPE  = "The user type can be one of four: school, work, hybrid and other."

users_post_args = reqparse.RequestParser()
users_post_args.add_argument(USERNAME, type=str, help=HELP_USERNAME, required=True)
users_post_args.add_argument(USER_TYPE, type=str, help=HELP_USER_TYPE, required=False)

user_put_args = reqparse.RequestParser()
user_put_args.add_argument(USERNAME, type=str, help=HELP_USERNAME, required=False)
user_put_args.add_argument(USER_TYPE, type=str, help=HELP_USER_TYPE, required=False)

class Users(Resource):
    def get(self):
        return exec_get_all(f"SELECT * FROM {USER_TABLE}")

    def post(self):
        args = users_post_args.parse_args()
        username = args[USERNAME]
        user_type = args[USER_TYPE]
        if len(exec_get_all(f"SELECT * FROM {USER_TABLE} WHERE {USERNAME} = '{username}';")) == 0:
            if user_type != 'school' and user_type != 'work' and user_type != 'hybrid':
                user_type = 'other'
            exec_commit(f"INSERT INTO {USER_TABLE}({USERNAME}, {USER_TYPE}) VALUES ('{username}', '{user_type}');")
            default_user_calendar(exec_get_one(f"SELECT * FROM {USER_TABLE} WHERE {USERNAME} = '{username}' and {USER_TYPE} = '{user_type}';")[0])
        else:
            return f"The username '{username}' already exists.", 403

    def delete(self):
        u_id = request.args.get('u_id')
        exec_commit(f"DELETE FROM {EVENT_TABLE} WHERE {U_ID} = {u_id};")
        exec_commit(f"DELETE FROM {USER_TABLE} WHERE {ID} = {u_id};")
        return f"User #{u_id} has been deleted along with their events."

class User(Resource):
    def get(self, id):
        return exec_get_all(f"SELECT * FROM user_table WHERE id = {id};")

    def put(self, id):
        args = user_put_args.parse_args()
        username = args[USERNAME]
        user_type = args[USER_TYPE]
        if len(exec_get_all(f"SELECT * FROM {USER_TABLE} WHERE {USERNAME} = '{username}';")) == 0:
            if username != None:
                exec_commit(f"UPDATE {USER_TABLE} SET {USERNAME} = '{username}' WHERE {ID} = {id};")
            if user_type != None:
                if user_type != 'school' and user_type != 'work' and user_type != 'hybrid' and user_type != 'other':
                    return f"The user type '{user_type}' does not exist. {HELP_USER_TYPE}", 404
                exec_commit(f"UPDATE {USER_TABLE} SET {USER_TYPE} = '{user_type}' WHERE {ID} = {id};")
        else:  
            return f"The username '{username}' already exists.", 403