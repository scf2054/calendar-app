from flask_restful import Resource

from flask_restful import request
from flask_restful import reqparse
import json

from .api_utils.post_utils import *
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

event_put_args = reqparse.RequestParser()
event_put_args.add_argument(EVENT_NAME, type=str, help=HELP_EVENT_NAME, required=False)
event_put_args.add_argument(EVENT_TYPE, type=str, help=HELP_EVENT_TYPE, required=False)
event_put_args.add_argument(EVENT_PRIORITY, type=int, help=HELP_EVENT_PRIORITY, required=False)
event_put_args.add_argument(START_TIME, type=str, help=HELP_START_TIME, required=False)
event_put_args.add_argument(END_TIME, type=str, help=HELP_END_TIME, required=False)
event_put_args.add_argument(DAY_ID, type=int, help=HELP_DAY_ID, required=False)
event_put_args.add_argument(EVENT_LOCATION, type=str, help=HELP_EVENT_LOCATION, required=False)

class Events(Resource):
    def get(self):
        return exec_get_all(f"SELECT * FROM {EVENT_TABLE};")

class Event(Resource):
    def get(self, id):
        return exec_get_one(f"SELECT * FROM {EVENT_TABLE} WHERE {ID} = {id};")

    def put(self, id):
        unchanged_event = exec_get_one(f"SELECT * FROM {EVENT_TABLE} WHERE {ID} = {id};")
        success_str = "The following have been changed: "
        args = event_put_args.parse_args()
        changes = ""
        # When changing the name, nothing else changes
        event_name = args[EVENT_NAME]
        if event_name:
            changes += f"{EVENT_NAME} = '{event_name}', "
            success_str += EVENT_NAME + " "
        else:
            event_name = unchanged_event[1]
        # When changing the type...
        homework_event_created = False
        event_type = args[EVENT_TYPE]
        if event_type:
            changes += f"{EVENT_TYPE} = '{event_type}', "
            success_str += EVENT_TYPE
            if unchanged_event[3] == 3:
                # If changing to 'school' and priority level 3, add a homework event
                if unchanged_event[2] != 'school' and event_type == 'school':
                    homework_event = create_homework_event(event_name, unchanged_event[5], unchanged_event[6], unchanged_event[7])
                    exec_commit(f"INSERT INTO {EVENT_TABLE}({EVENT_NAME}, {EVENT_TYPE}, {EVENT_PRIORITY}, {START_TIME}, {END_TIME}, {U_ID}, {DAY_ID}, {EVENT_LOCATION}) VALUES {homework_event};")
                    success_str += " (and a corresponding homework event has been added)"
                    homework_event_created = True
                # If changing from school and priority level 3, remove its homework event
                elif unchanged_event[2] == 'school' and event_type != 'school':
                    success_str += " (the homework event may still exist for this event)"
            success_str += " "
        else:
            event_type = unchanged_event[2]
        # When changing priority...
        event_priority = args[EVENT_PRIORITY]
        if event_priority:
            changes += f"{EVENT_PRIORITY} = {event_priority}, "
            success_str += EVENT_PRIORITY
            if event_type == 'school':
                # If the new priority is 3 and type is 'school' create a homework event
                if event_priority == 3 and not homework_event_created:
                    homework_event = create_homework_event(event_name, unchanged_event[5], unchanged_event[6], unchanged_event[7])
                    exec_commit(f"INSERT INTO {EVENT_TABLE}({EVENT_NAME}, {EVENT_TYPE}, {EVENT_PRIORITY}, {START_TIME}, {END_TIME}, {U_ID}, {DAY_ID}, {EVENT_LOCATION}) VALUES {homework_event};")
                    success_str += " (and a corresponding homework event has been added)"
                # If the original priority was three and the new one isn't three and is of type 'school', delete its homework event
                elif unchanged_event[3] == 3 and event_priority != 3:
                    success_str += " (the homework event may still exist for this event)"
            success_str += " "
        else:
            event_priority = unchanged_event[3]
        # When changing start time, check if it overlaps a high prority event
        # Same for end time and day id
        start_time = args[START_TIME]
        end_time = args[END_TIME]
        day_id = args[DAY_ID]
        temp = [START_TIME, END_TIME, DAY_ID]
        start_changed = True
        end_changed = True
        if not start_time:
            start_time = unchanged_event[4]
            temp.remove(START_TIME)
            start_changed = False
        if not end_time:
            end_time = unchanged_event[5]
            temp.remove(END_TIME)
            end_changed = False
        if not day_id:
            day_id = unchanged_event[7]
            temp.remove(DAY_ID)
        if time_is_greater(start_time, end_time):
            if end_changed and not start_changed:
                start_time = subtract_times(end_time, '00:30')
                temp.append(START_TIME)
            elif start_changed and not end_changed:
                end_time = add_times(start_time, '00:30')
                temp.append(END_TIME)
            elif start_changed and end_changed and event_name != 'Sleep':
                return f"The start time must come before the end time: {start_time}, {end_time}", 406
        if start_time > end_time:
            if overlaps_high_priority(unchanged_event[6], day_id, start_time, '23:59', unchanged_event[0]) and overlaps_high_priority(unchanged_event[6], day_id, '0:00', end_time, unchanged_event[0]):
                return f"This new time overlaps a high priority event, failed to update calendar...", 406
        elif overlaps_high_priority(unchanged_event[6], day_id, start_time, end_time, unchanged_event[0]):
            return f"This new time overlaps a high priority event, failed to update calendar...", 406
        changes += f"{START_TIME} = '{start_time}', {END_TIME} = '{end_time}', {DAY_ID} = {day_id}, "
        for x in temp:
            success_str += x + " "
        # When changing event location, nothing else changes
        event_location = args[EVENT_LOCATION]
        if event_location:
            changes += f"{EVENT_LOCATION} = '{event_location}', "
            success_str += EVENT_LOCATION + " "
        changes += f"{U_ID} = {unchanged_event[6]}"
        exec_commit(f"UPDATE {EVENT_TABLE} SET {changes} WHERE {ID} = {id};")
        return success_str

class User_Events(Resource):
    def get(self, u_id):
        return exec_get_all(f"SELECT * FROM {EVENT_TABLE} WHERE {U_ID} = {u_id};")

    def post(self, u_id):
        args = user_events_post_args.parse_args()
        event_name = args[EVENT_NAME]
        event_type = args[EVENT_TYPE]
        if not event_type:
            event_type = 'custom'
        event_priority = args[EVENT_PRIORITY]
        if not event_priority:
            if event_type == 'special':
                event_priority = 2
            elif event_type == 'work':
                event_priority = 3
            else:
                event_priority = 1
        start_time = args[START_TIME]
        end_time = args[END_TIME]
        if not end_time:
            end_time = add_times(start_time, '0:30')
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
        if overlaps_high_priority(u_id, day_id, start_time, end_time):
            day_name = exec_get_one(f"SELECT * FROM {DAY_OF_WEEK} WHERE {ID} = {day_id};")
            return f"This new event overlaps a high priority event, failed to add to {day_name}...", 406
        exec_commit(f"INSERT INTO {EVENT_TABLE}({EVENT_NAME}, {EVENT_TYPE}, {EVENT_PRIORITY}, {START_TIME}, {END_TIME}, {U_ID}, {DAY_ID}, {EVENT_LOCATION}) VALUES {values};")
        return "Event successfully added to calendar!"

    def delete(self, u_id):
        id = request.args.get('id')
        event = exec_get_one(f"SELECT * FROM {EVENT_TABLE} WHERE {ID} = {id};")
        if event[6] != u_id:
            return f"User #{u_id} doesn't have permission to delete course #{id}.", 403
        exec_commit(f"DELETE FROM {EVENT_TABLE} WHERE {ID} = {id};")
        return f"User #{u_id} has deleted course #{id}."

class Sleep(Resource):
    def get(self, u_id, day_id):
        return exec_get_one(f"SELECT * FROM {EVENT_TABLE} WHERE {U_ID} = {u_id} AND {DAY_ID} = {day_id} AND {EVENT_NAME} = 'Sleep';")