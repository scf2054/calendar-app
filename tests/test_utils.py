from logging import error
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
        self.assertEqual(28, len(exec_get_all(f"SELECT * FROM {EVENT_TABLE} WHERE {U_ID} = 2;")), "Default calendar not created correctly.")
        print("Default calendar created!")

    def test_create_homework_event(self):
        homework = create_homework_event('Class', '12:55', 1, 4)
        self.assertEqual(homework, ('Class Homework', 'school', 1, '13:10', '13:40', 1, 4, ""), 'Homework event was not created correctly.')
        try:
            exec_commit(f"INSERT INTO {EVENT_TABLE}({EVENT_NAME}, {EVENT_TYPE}, {EVENT_PRIORITY}, {START_TIME}, {END_TIME}, {U_ID}, {DAY_ID}, {EVENT_LOCATION}) VALUES {str(homework)};")
        except:
            self.assertTrue(False, 'Error adding homework to the database.')
            return
        self.assertEqual((62, 'Class Homework', 'school', 1, '13:10', '13:40', 1, 4, ""), exec_get_one(f"SELECT * FROM {EVENT_TABLE} WHERE {ID} = 62;"), 'Homework was not added to the database.')
        print("Homework event created successfully!")

if __name__ == '__main__':
    unittest.main()