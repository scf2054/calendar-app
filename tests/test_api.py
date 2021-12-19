import unittest
import json
from server.api.api_utils.rest_utils import *

class TestExample(unittest.TestCase):
    def test_api(self):
        result = get_rest_call(self, 'http://localhost:5000/users')
        self.assertEqual([1, 'Sam Frost', 'hybrid'], result[0],"Should have returned a count of '9'")
        print("API test successfully returned a count of '9' ")

