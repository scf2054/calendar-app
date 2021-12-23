import unittest
import json
from server.api.api_utils.rest_utils import *
from server.api.db.db_utils import exec_sql_file

class TestExample(unittest.TestCase):

    def setUp(self) -> None:
        self.maxDiff = None
        exec_sql_file('schema.sql')
        return super().setUp()

    def test_api(self):
        result = get_rest_call(self, 'http://localhost:5000/users')
        self.assertEqual([1, 'Sam Frost', 'student'], result[0],"Should have returned a count of '9'")
        print("API test successfully returned one student")

