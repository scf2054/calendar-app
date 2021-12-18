from os import error
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

    def test_post_users_default_calendar(self):
        post_rest_call(self, 'http://127.0.0.1:5000/users', {USERNAME: 'Jill Conti', USER_TYPE: 'school'})
        self.assertEqual((2, 2, '1,2,3,4', '1,2,3,4', '1,2,3,4', '1,2,3,4', '1,2,3,4', '1,2,3,4', '1,2,3,4'), exec_get_one(f"SELECT * FROM {CALENDAR_TABLE} WHERE {ID} = 2;"), "New calendar not inserted")
        print("New account created!")
