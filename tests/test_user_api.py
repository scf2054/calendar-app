import unittest

from server.api.db.db_utils import *
from server.api.constants import *
from server.api.api_utils.rest_utils import *

class TestUser(unittest.TestCase):

    def setUp(self) -> None:
        self.maxDiff = None
        exec_sql_file('schema.sql')
        return super().setUp()

    def test_post_users(self):
        response = post_rest_call(self, 'http://127.0.0.1:5000/users', {USERNAME: 'Jill Conti', USER_TYPE: 'school'})
        self.assertEqual(response, 2, 'The ID returned is not the correct one')
        print("User successfully created!")

    def test_post_users_fail(self):
        response = post_rest_call(self, 'http://127.0.0.1:5000/users', {USERNAME: 'Sam Frost', USER_TYPE: 'school'}, {}, 403)
        self.assertEqual(response, "The username 'Sam Frost' already exists.")
        print("Post has failed!")

    def test_put_users_fail_username(self):
        response = put_rest_call(self, 'http://127.0.0.1:5000/users/1', {USERNAME: 'Sam Frost', USER_TYPE: 'school'}, {}, 403)
        self.assertEqual(response, "The username 'Sam Frost' already exists.")
        print("Post username has failed!")

    def test_put_users_fail_user_type(self):
        response = put_rest_call(self, 'http://127.0.0.1:5000/users/1', {USERNAME: 'Jill Conti', USER_TYPE: 'sschool'}, {}, 404)
        self.assertEqual(response, "The user type 'sschool' does not exist. The user type can be one of four: school, work, hybrid and other.")
        print("Post user type has failed!")

    def test_put_users_username(self):
        put_rest_call(self, 'http://127.0.0.1:5000/users/1', {USERNAME: 'Jill Conti'})
        self.assertEqual((1, 'Jill Conti', 'student', None, None), exec_get_one(f"SELECT * FROM {USER_TABLE} WHERE {ID} = 1;"), "Username was not changed")
        print("Username was changed!")

    def test_put_users_user_type(self):
        put_rest_call(self, 'http://127.0.0.1:5000/users/1', {USER_TYPE: 'school'})
        self.assertEqual((1, 'Sam Frost', 'school', None, None), exec_get_one(f"SELECT * FROM {USER_TABLE} WHERE {ID} = 1;"), "User type was not changed")
        print("User type was changed!")

    def test_put_users_both(self):
        put_rest_call(self, 'http://127.0.0.1:5000/users/1', {USERNAME: 'Jill Conti', USER_TYPE: 'school'})
        self.assertEqual((1, 'Jill Conti', 'school', None, None), exec_get_one(f"SELECT * FROM {USER_TABLE} WHERE {ID} = 1;"), "User type was not changed")
        print("Username and user type was changed!")

    def test_delete_user(self):
        delete_rest_call(self, 'http://127.0.0.1:5000/users?u_id=1')
        self.assertEqual(len(exec_get_all(f"SELECT * FROM {EVENT_TABLE} WHERE {U_ID} = 1;")), 0, "Not all events were deleted")
        self.assertEqual(len(exec_get_all(f"SELECT * FROM {USER_TABLE} WHERE {ID} = 1;")), 0, "Not all users were deleted")
        print("User and their events were deleted!")

if __name__ == '__main__':
    unittest.main()