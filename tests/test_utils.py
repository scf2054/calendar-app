import unittest

from server.api.db.db_utils import *
from server.api.constants import *
from server.api.api_utils.rest_utils import *
from server.api.api_utils.post_utils import *

class TestUtils(unittest.TestCase):

    def setUp(self) -> None:
        self.maxDiff = None
        exec_sql_file('schema_redo.sql')
        return super().setUp()

    def test_optimize_calendar(self):

        optimize_calendar(1)

if __name__ == '__main__':
    unittest.main()