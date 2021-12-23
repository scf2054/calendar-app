import unittest

from server.api.db.db_utils import *
from server.api.constants import *
from server.api.api_utils.rest_utils import *

class TestUser(unittest.TestCase):

    def setUp(self) -> None:
        self.maxDiff = None
        exec_sql_file('schema.sql')
        return super().setUp()

    # Users
    def test_post_users_fail(self):
        try:
            post_rest_call(self, 'http://127.0.0.1:5000/users', {USERNAME: 'Sam Frost', USER_TYPE: 'school'})
            self.assertTrue(False, "Post did not fail")
        except:
            self.assertTrue(True)
            print("Post has failed!")
            
    def test_put_users_fail_username(self):
        try:
            put_rest_call(self, 'http://127.0.0.1:5000/users/1', {USERNAME: 'Sam Frost', USER_TYPE: 'school'})
            self.assertTrue(False, "Post username did not fail")
        except:
            self.assertTrue(True)
            print("Post username has failed!")

    def test_put_users_fail_user_type(self):
        try:
            put_rest_call(self, 'http://127.0.0.1:5000/users/1', {USERNAME: 'Jill Conti', USER_TYPE: 'sschool'})
            self.assertTrue(False, "Post user type did not fail")
        except:
            self.assertTrue(True)
            print("Post user type has failed!")

    def test_put_users_username(self):
        put_rest_call(self, 'http://127.0.0.1:5000/users/1', {USERNAME: 'Jill Conti'})
        self.assertEqual((1, 'Jill Conti', 'student'), exec_get_one(f"SELECT * FROM {USER_TABLE} WHERE {ID} = 1;"), "Username was not changed")
        print("Username was changed!")

    def test_put_users_user_type(self):
        put_rest_call(self, 'http://127.0.0.1:5000/users/1', {USER_TYPE: 'school'})
        self.assertEqual((1, 'Sam Frost', 'school'), exec_get_one(f"SELECT * FROM {USER_TABLE} WHERE {ID} = 1;"), "User type was not changed")
        print("User type was changed!")

    def test_put_users_both(self):
        put_rest_call(self, 'http://127.0.0.1:5000/users/1', {USERNAME: 'Jill Conti', USER_TYPE: 'school'})
        self.assertEqual((1, 'Jill Conti', 'school'), exec_get_one(f"SELECT * FROM {USER_TABLE} WHERE {ID} = 1;"), "User type was not changed")
        print("Username and user type was changed!")


if __name__ == '__main__':
    unittest.main()