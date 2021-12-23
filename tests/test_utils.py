import unittest

from server.api.db.db_utils import *
from server.api.constants import *
from server.api.api_utils.rest_utils import *
from server.api.api_utils.post_utils import *

class TestUtils(unittest.TestCase):

    def setUp(self) -> None:
        self.maxDiff = None
        exec_sql_file('schema.sql')
        return super().setUp()

    def test_optimize_calendar(self):

        optimize_calendar(1)

    def test_default_user_calendar(self):
        exec_commit(f"INSERT INTO {USER_TABLE}({USERNAME}) VALUES ('Jill Conti');")
        default_user_calendar(2)
        self.assertEqual(21, len(exec_get_all(f"SELECT * FROM {EVENT_TABLE} WHERE {U_ID} = 2;")), "Default calendar not created correctly.")
        print("Default calendar created!")

if __name__ == '__main__':
    unittest.main()