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
        optimize_calendar(exec_get_one(f"SELECT * FROM {CALENDAR_TABLE}"))

if __name__ == '__main__':
    unittest.main()