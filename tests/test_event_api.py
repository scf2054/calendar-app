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
        response = post_rest_call(self, 'http://127.0.0.1:5000/events/user/1', {START_TIME: '8:00', DAY_ID: 1, EVENT_TYPE: 'failing event type', EVENT_PRIORITY: 3}, {}, 404)
        self.assertEqual(response, "Event type 'failing event type' does not exist.")
        print("Incorrect event type caught!")

    def test_post_user_events_overlapping_events_middle(self):
        response = post_rest_call(self, 'http://127.0.0.1:5000/events/user/1', {START_TIME: '10:00', END_TIME: '10:50', DAY_ID: 2, EVENT_TYPE: 'work', EVENT_PRIORITY: 3}, {}, 406)
        self.assertEqual(response, "This new event overlaps a high priority event, failed to add to calendar...")
        print("Overlapping middle was not added!")

    def test_post_user_events_overlapping_events_left(self):
        response = post_rest_call(self, 'http://127.0.0.1:5000/events/user/1', {START_TIME: '11:30', END_TIME: '12:20', DAY_ID: 2, EVENT_TYPE: 'work', EVENT_PRIORITY: 2}, {}, 406)
        self.assertEqual(response, "This new event overlaps a high priority event, failed to add to calendar...")
        print("Overlapping left was not added!")

    def test_post_user_events_overlapping_events_right(self):
        response = post_rest_call(self, 'http://127.0.0.1:5000/events/user/1', {START_TIME: '14:30', END_TIME: '15:20', DAY_ID: 2, EVENT_TYPE: 'work', EVENT_PRIORITY: 1}, {}, 406)
        self.assertEqual(response, "This new event overlaps a high priority event, failed to add to calendar...")
        print("Overlapping right was not added!")

    def test_put_event_name(self):
        response = put_rest_call(self, 'http://127.0.0.1:5000/events/32', {EVENT_NAME: "New Name"})
        self.assertEqual(exec_get_one(f"SELECT * FROM {EVENT_TABLE} WHERE {ID} = 32;")[1], "New Name", "Event name was not changed")
        self.assertEqual(response, f"The following have been changed: {EVENT_NAME} ", "The response was not returned correctly for event name")
        print("Event name changed!")

    def test_put_event_type(self):
        response = put_rest_call(self, 'http://127.0.0.1:5000/events/43', {EVENT_TYPE: 'special'})
        self.assertEqual(exec_get_one(f"SELECT * FROM {EVENT_TABLE} WHERE {ID} = 43;")[2], 'special', "Event type was not changed to special correctly")
        self.assertEqual(response, f"The following have been changed: {EVENT_TYPE} ", "The response was not returned correctly for event type")
        print("Event type was hanged to special!")

    def test_put_event_type_from_school(self):
        response = put_rest_call(self, 'http://127.0.0.1:5000/events/32', {EVENT_TYPE: "work"})
        self.assertEqual(exec_get_one(f"SELECT * FROM {EVENT_TABLE} WHERE {ID} = 32;")[2], "work", "Event type was not changed to work correctly")
        self.assertEqual(response, f"The following have been changed: {EVENT_TYPE} (the homework event may still exist for this event) ", "The response was not returned correctly for event type")
        print("Event type was changed to work!")

    def test_put_event_type_to_school(self):
        response = put_rest_call(self, 'http://127.0.0.1:5000/events/43', {EVENT_TYPE: "school"})
        self.assertEqual(exec_get_one(f"SELECT * FROM {EVENT_TABLE} WHERE {ID} = 43;")[2], "school", "Event type was not changed to school correctly")
        self.assertIsNotNone(exec_get_one(f"SELECT * FROM {EVENT_TABLE} WHERE {ID} = 62;"), "Homework event was not created correctly")
        self.assertEqual(response, f"The following have been changed: {EVENT_TYPE} (and a corresponding homework event has been added) ", "The response was not returned correctly for event type")
        print("Event type was changed and homework was added!")

    def test_put_event_priority(self):
        response = put_rest_call(self, 'http://127.0.0.1:5000/events/18', {EVENT_PRIORITY: 1})
        self.assertEqual(exec_get_one(f"SELECT * FROM {EVENT_TABLE} WHERE {ID} = 18;")[3], 1, 'Event priority was not changed from 2 to 1 correctly')
        self.assertEqual(response, f"The following have been changed: {EVENT_PRIORITY} ", 'The response was not returned correctly for event priority')
        print("Event priority was changed from 2 to 1!")

    def test_put_event_priority_school_to_3(self):
        response = put_rest_call(self, 'http://127.0.0.1:5000/events/61', {EVENT_PRIORITY: 3})
        self.assertEqual(exec_get_one(f"SELECT * FROM {EVENT_TABLE} WHERE {ID} = 61;")[3], 3, 'Event priority was not changed from 2 to 3 correctly')
        self.assertIsNotNone(exec_get_one(f"SELECT * FROM {EVENT_TABLE} WHERE {ID} = 62;"), "Homework event was not created correctly")
        self.assertEqual(response, f"The following have been changed: {EVENT_PRIORITY} (and a corresponding homework event has been added) ", 'The response was not returned correctly for event priority')
        print("Event priority was changed from 1 to 3 and homework event created!")

    def test_put_event_priority_school_from_3(self):
        response = put_rest_call(self, 'http://127.0.0.1:5000/events/29', {EVENT_PRIORITY: 2})
        self.assertEqual(exec_get_one(f"SELECT * FROM {EVENT_TABLE} WHERE {ID} = 29;")[3], 2, 'Event priority was not changed from 3 to 2 correctly')
        self.assertEqual(response, f"The following have been changed: {EVENT_PRIORITY} (the homework event may still exist for this event) ", 'The response was not returned correctly for event priority')
        print("Event priority was changed from 3 to 2!")

    def test_put_event_type_to_school_priority_to_3(self):
        response = put_rest_call(self, 'http://127.0.0.1:5000/events/1', {EVENT_PRIORITY: 3, EVENT_TYPE: 'school'})
        event = exec_get_one(f"SELECT * FROM {EVENT_TABLE} WHERE {ID} = 1;")
        self.assertEqual(event[3], 3, 'Event priority was not changed from 2 to 3 correctly')
        self.assertEqual(event[2], 'school', 'Event type was not changed from special to school correctly')
        self.assertIsNotNone(exec_get_one(f"SELECT * FROM {EVENT_TABLE} WHERE {ID} = 62;"), "The correct homework event was not created")
        self.assertIsNone(exec_get_one(f"SELECT * FROM {EVENT_TABLE} WHERE {ID} = 63;"), "Two homework events were created")
        self.assertEqual(response, f"The following have been changed: {EVENT_TYPE} {EVENT_PRIORITY} (and a corresponding homework event has been added) ", "The response was ot returned correctly for event priority and type")
        print("The correct type and priority were changed and only one homework event was created!")

    def test_put_start_time(self):
        response = put_rest_call(self, 'http://127.0.0.1:5000/events/2', {START_TIME: '14:00'})
        event = exec_get_one(f"SELECT * FROM {EVENT_TABLE} WHERE {ID} = 2;")
        self.assertEqual(event[4], '14:00', 'Start time was not updated correctly')
        self.assertEqual(event[5], '14:30', 'The new end time was not updated accordingly')
        self.assertEqual(response, f"The following have been changed: {START_TIME} {END_TIME} ", "The response for start time was not returned correctly")
        print("Start time was updated successfully!")

    def test_put_end_time(self):
        response = put_rest_call(self, 'http://127.0.0.1:5000/events/2', {END_TIME: '12:00'})
        event = exec_get_one(f"SELECT * FROM {EVENT_TABLE} WHERE {ID} = 2;")
        self.assertEqual(event[4], '11:30', 'Start time was not updated accordingly')
        self.assertEqual(event[5], '12:00', 'The new end time was not updated')
        self.assertEqual(response, f"The following have been changed: {END_TIME} {START_TIME} ", "The response for end time was not returned correctly")
        print("End time was updated successfully!")

    def test_put_start_and_end_time(self):
        response = put_rest_call(self, 'http://127.0.0.1:5000/events/2', {END_TIME: '12:00', START_TIME: '11:00'})
        event = exec_get_one(f"SELECT * FROM {EVENT_TABLE} WHERE {ID} = 2;")
        self.assertEqual(event[4], '11:00', 'The new start time was not updated')
        self.assertEqual(event[5], '12:00', 'The new end time was not updated')
        self.assertEqual(response, f"The following have been changed: {START_TIME} {END_TIME} ", "The response for start and end time was not returned correctly")
        print("Start and end time was updated successfully!")

    def test_put_start_and_end_time_fail(self):
        response = put_rest_call(self, 'http://127.0.0.1:5000/events/2', {END_TIME: '11:00', START_TIME: '12:00'}, {}, 406)
        self.assertEqual(response, "The start time must come before the end time: 12:00, 11:00")
        print("Start and end time failed successfully!")

    def test_put_day_id(self):
        response = put_rest_call(self, 'http://127.0.0.1:5000/events/3', {DAY_ID: 2})
        self.assertEqual(exec_get_one(f"SELECT * FROM {EVENT_TABLE} WHERE {ID} = 3;")[7], 2, "The day id was not updated correctly")
        self.assertEqual(response, f"The following have been changed: {DAY_ID} ", "The response for day id was not returned correctly")
        print("Day ID updated successfully!")

    def test_put_event_location(self):
        response = put_rest_call(self, 'http://127.0.0.1:5000/events/3', {EVENT_LOCATION: "Mama Gs"})
        self.assertEqual(exec_get_one(f"SELECT * FROM {EVENT_TABLE} WHERE {ID} = 3;")[8], "Mama Gs", "The event location was nnot updated correctly")
        self.assertEqual(response, f"The following have been changed: {EVENT_LOCATION} ", "The response for the event location was not returned correctly")
        print("Event location updated successfully!")

if __name__ == '__main__':
    unittest.main()