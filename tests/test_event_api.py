import unittest

from server.api.db.db_utils import *
from server.api.constants import *
from server.api.api_utils.rest_utils import *

class TestEvent(unittest.TestCase):

    def setUp(self) -> None:
        self.maxDiff = None
        exec_sql_file('schema.sql')
        return super().setUp()

    def test_post_user_events_default_values(self):
        post_rest_call(self, 'http://127.0.0.1:5000/events/user/1', {START_TIME: '8:00', DAY_ID: 1})
        expected = (62, 'Custom Event', 'custom', 1, '8:00', '9:00', 1, 1, '')
        actual = exec_get_one(f"SELECT * FROM {EVENT_TABLE} WHERE {ID} = 62;")
        self.assertEqual(expected, actual, 'Default values were not entered correctly')
        print("Default values successfully implemented!")

    def test_post_user_events_create_homework_event(self):
        post_rest_call(self, 'http://127.0.0.1:5000/events/user/1', {START_TIME: '8:00', DAY_ID: 1, EVENT_TYPE: 'school', EVENT_PRIORITY: 3})
        expected_hw = (62, 'Class Homework', 'school', 1, '9:15', '9:45', 1, 1, '')
        actual_hw = exec_get_one(f"SELECT * FROM {EVENT_TABLE} WHERE {ID} = 62;")
        expected_class = (63, 'Class', 'school', 3, '8:00', '9:00', 1, 1, '')
        actual_class = exec_get_one(f"SELECT * FROM {EVENT_TABLE} WHERE {ID} = 63;")
        self.assertEqual(expected_hw, actual_hw, 'Homework event not added correctly')
        self.assertEqual(expected_class, actual_class, 'Class event was not added correctly')
        print("Homework and class events successfully added")