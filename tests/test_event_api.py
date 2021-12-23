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

    def test_post_user_events_wrong_event_type(self):
        try:
            post_rest_call(self, 'http://127.0.0.1:5000/events/user/1', {START_TIME: '8:00', DAY_ID: 1, EVENT_TYPE: 'failing event type', EVENT_PRIORITY: 3})
            self.assertTrue(False, 'Event type was not caught')
        except:
            self.assertTrue(True)
            print("Incorrect event type caught!")

    def test_post_user_events_overlapping_events_middle(self):
            try:
                post_rest_call(self, 'http://127.0.0.1:5000/events/user/1', {START_TIME: '10:00', END_TIME: '10:50', DAY_ID: 2, EVENT_TYPE: 'work', EVENT_PRIORITY: 3})
                self.assertTrue(False, "Event was not caught to be overlapping middle")
            except Exception:
                self.assertTrue(True, "Wrong error occurred for middle overlapping")
                print("Overlapping middle was not added!")

    def test_post_user_events_overlapping_events_left(self):
        try:
            post_rest_call(self, 'http://127.0.0.1:5000/events/user/1', {START_TIME: '11:30', END_TIME: '12:20', DAY_ID: 2, EVENT_TYPE: 'work', EVENT_PRIORITY: 3})
            self.assertTrue(False, "Event was not caught to be overlapping left")
        except Exception:
            self.assertTrue(True, "Wrong error occurred for middle overlapping")
            print("Overlapping left was not added!")


    def test_post_user_events_overlapping_events_right(self):
        try:
            post_rest_call(self, 'http://127.0.0.1:5000/events/user/1', {START_TIME: '14:30', END_TIME: '15:20', DAY_ID: 2, EVENT_TYPE: 'work', EVENT_PRIORITY: 3})
            self.assertTrue(False, "Event was not caught to be overlapping right")
        except Exception:
            self.assertTrue(True, "Wrong error occurred for middle overlapping")
            print("Overlapping right was not added!")
