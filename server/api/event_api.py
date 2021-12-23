from flask_restful import Resource

from flask_restful import request
from flask_restful import reqparse
import json

from server.api.api_utils.post_utils import add_times, create_homework_event, optimize_calendar
from .db.db_utils import *
from .constants import *

HELP_EVENT_NAME = "The name of the event"
HELP_EVENT_TYPE = "The type of event this event is. Can be: work, school, special, or custom (default)."
HELP_EVENT_PRIORITY = "The priority level of the event. 1 being the lowest (time can be adjusted), 2 being the medium (can be adjusted in last resort) and 3 being the highest (time frame cannot change)."
HELP_START_TIME = "The starting time of the event. In format: 'hh:mm'."
HELP_END_TIME = "The ending time of the event. In format: 'hh:mm'. Defaults to the time half an hour after the starting time."
HELP_U_ID = "The ID of the user from the database that has the event."
HELP_DAY_ID = "The ID of the day that's contained in the day_of_week table of the database."
HELP_EVENT_LOCATION = "The location of where the event is taking place."

user_events_post_args = reqparse.RequestParser()
user_events_post_args.add_argument(EVENT_NAME, type=str, help=HELP_EVENT_NAME, required=False)
user_events_post_args.add_argument(EVENT_TYPE, type=str, help=HELP_EVENT_TYPE, required=False)
user_events_post_args.add_argument(EVENT_PRIORITY, type=int, help=HELP_EVENT_PRIORITY, required=False)
user_events_post_args.add_argument(START_TIME, type=str, help=HELP_START_TIME, required=True)
user_events_post_args.add_argument(END_TIME, type=str, help=HELP_END_TIME, required=False)
user_events_post_args.add_argument(DAY_ID, type=int, help=HELP_DAY_ID, required=True)
user_events_post_args.add_argument(EVENT_LOCATION, type=str, help=HELP_EVENT_LOCATION, required=False)

class Events(Resource):
    def get(self):
        return exec_get_all(f"SELECT * FROM {EVENT_TABLE};")

class Event(Resource):
    def get(self, id):
        return exec_get_one(f"SELECT * FROM {EVENT_TABLE} WHERE {ID} = {id};")

class User_Events(Resource):
    def get(self, u_id):
        return exec_get_all(f"SELECT * FROM {EVENT_TABLE} WHERE {U_ID} = {u_id};")

    def post(self, u_id):
        args = user_events_post_args.parse_args()
        event_name = args[EVENT_NAME]
        event_type = args[EVENT_TYPE]
        event_priority = args[EVENT_PRIORITY]
        if not event_priority:
            event_priority = 1
        start_time = args[START_TIME]
        end_time = args[END_TIME]
        if not end_time:
            end_time = add_times(start_time, '1:00')
        day_id = args[DAY_ID]
        event_location = args[EVENT_LOCATION]
        if not event_location:
            event_location = ""
        values = ""
        # If the event is a class, create a homework event and add it to the database
        if event_type == 'school':
            if not event_name:
                event_name = "Class"
            if event_priority == 3:
                homework_event = create_homework_event(event_name, end_time, u_id, day_id)
                values += str(homework_event) + ", "
        elif not event_name:
            if event_type == 'special':
                event_name = "Special Event"
            elif event_type == 'custom':
                event_name = "Custom Event"
            elif event_type == 'work':
                event_name = "Work Shift"
            else:
                return f"Event type '{event_type}' does not exist.", 404
        values += f"('{event_name}', '{event_type}', {event_priority}, '{start_time}', '{end_time}', {u_id}, {day_id}, '{event_location}')"
        exec_commit(f"INSERT INTO {EVENT_TABLE}({EVENT_NAME}, {EVENT_TYPE}, {EVENT_PRIORITY}, {START_TIME}, {END_TIME}, {U_ID}, {DAY_ID}, {EVENT_LOCATION}) VALUES {values};")
        try:
            optimize_calendar(u_id)
        except ValueError as e:
            return str(e)
        return "Event successfully added to your calendar!"