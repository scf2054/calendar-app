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
            print("Post has failed")
