from ..db.db_utils import *
from ..constants import *
import math

BREAKFAST_FRAME = ['7:00', '12:00']
LUNCH_FRAME = ['11:00', '16:00']
DINNER_FRAME = ['15:00', '20:00']

def optimize_calendar(u_id):
    """Given a calendar from the database, which is all events with the user's id,
    this function iterates over every single event in every single day of the week 
    and optimizes it based on sleep, meals, calsses, work, and everything that was 
    added by the user.

    Args:
        u_id (int): The ID of the user who is optimizing their calendar
    """
    # Initialize all data that will be used
    days = initialize_days(u_id)
    day_leftovers = []
    for day in days:
        high_priorities = day[0]
        medium_priorities = day[1]
        low_priorities = day[2]
        day_id = days.index(day) + 2
        if day_id > len(days) + 1:
            day_id = 1
        sleep = exec_get_one(f"SELECT {START_TIME}, {END_TIME} FROM {EVENT_TABLE} WHERE {U_ID} = {u_id} AND {DAY_ID} = {day_id} AND {EVENT_PRIORITY} = 2 AND {EVENT_NAME} = 'Sleep';")
        sleep_frame = {sleep[0]: sleep[1]}
        free_time = {'0:00': '23:59'}
        # Optimize the highest priority group to get the earliest and latest times
        earliest_latest = optimize_priority_group(high_priorities, free_time, 3)
        # Add the sleep schedule to free time...
        # Remove the value at '0:00', this value should already be stored in the 'earliest' variable
        free_time.pop('0:00')
        bedtime = list(sleep_frame.keys())[0]
        # The value at sleep's end should now be the earliest time
        free_time[sleep_frame[bedtime]] = earliest_latest[0]
        # The value at the latest all events go should now be the bedtime
        free_time[earliest_latest[1]] = bedtime
        medium_leftovers = optimize_priority_group(medium_priorities + day_leftovers, free_time, 2)
        day_leftovers = optimize_priority_group(low_priorities + medium_leftovers, free_time, 1)
    return f"The calendar for user #{u_id} has been optimized."

def optimize_priority_group(priority_group, free_time, priority):
    """Given a group of events with the same priority, all of the free time, and 
    the priority number of each event, this function removes all of the times that 
    are taken up by priority_group events from the free_time dictionary. This works
    for any priority group: 1, 2, or 3, and adjusts itself based on that priority number.
    This is a hlper function for the optimize_calendar function and is quite specific to
    its desires, so calling this outside of that function isn't recommended.

    Args:
        priority_group (list): A list of all the events with the same priority number
        free_time (dict): A dictionary of start:end time pairs based on the amount of free time
        a user has
        priority (int): Either values: 1, 2, or 3 and has to correspond to the priority group
        pased in

    Returns:
        list: A list that contains the values [earliest, latest] times throughout the day
        solely based on the highest priority events that were passed in. This means that 
        these values will only be returned when passed in high priority groups.
    """
    # Initialize the earliest and latest
    earliest = '23:59'
    latest = '00:00'
    leftovers = []
    # For each event in priorities...
    for event in priority_group:
        # Get the starting and ending time
        meal_frame = get_meal_frame(event[1])
        event_start = event[4]
        event_end = event[5]
        new_start = event_start
        new_end = event_end
        free_time_count = 0
        # For each time frame in free time...
        for free_start in free_time:
            free_time_count += 1
            free_end = free_time[free_start]
            # Check if the free time is in the desired meal time frame, if not coninue
            if priority == 2 and not overlaps_at_all(free_start, free_end, meal_frame[0], meal_frame[1]):
                continue
            # Calculate the length of the event and free time
            event_length = length_between_times(event_start, event_end)
            free_length = length_between_times(free_start, free_end)
            # As long as the length of free time is greater than or equal to the event...
            if time_is_greater(free_length, event_length, True):
                # If the event takes place during free time...
                # This should be the only "if" that passes for the highest priority
                if overlaps_middle(event_start, event_end, free_start, free_end):
                    # Change the free time and leave the time frame alone
                    free_time[free_start] = event_start
                    free_time[event_end] = free_end
                    # Only when the priority is 3 should you update the earliest and latest times
                    if priority == 3:
                        if time_is_greater(earliest, event_start):
                            earliest = event_start
                        if time_is_greater(event_end, latest):
                            latest = event_end
                    break
                elif priority != 3:
                    is_during_event = during_event([event_start, event_end], [free_start, free_end], free_time)
                    # If the event overlaps an event that's already there...
                    if is_during_event[0]:
                        overlapped_event_end = is_during_event[1]
                        # Calculate distance between right side and left side
                        length_of_left_side = length_between_times(event_start, free_end)
                        length_of_right_side = length_between_times(event_end, overlapped_event_end)
                        # If distance is shorter on left side...
                        if time_is_greater(length_of_right_side, length_of_left_side, True):
                            # Set new start/end
                            new_end = free_end
                            new_start = subtract_times(new_end, event_length)
                            # Update free_time
                            if event_length == free_length:
                                free_time.pop(free_start)
                            else:
                                free_time[free_start] = new_start
                            break
                        # If distance is shorter on right side and the free time frame length on the right side is greater than the event's...
                        else:
                            free_after_overlapped_end = free_time[overlapped_event_end]
                            free_after_length = length_between_times(overlapped_event_end, free_after_overlapped_end)
                            if time_is_greater(free_after_length, event_length, True):
                                # Set new start/end
                                new_start = overlapped_event_end
                                new_end = add_times(new_start, event_length)
                                # Update free_time
                                if event_length != free_length:
                                    free_time[new_end] = free_time[free_start]
                                free_time.pop(free_start)
                                break
                    # If the event overlaps to the left of a free time
                    elif overlaps_left(event_start, event_end, free_start, free_end):
                        # The new end of the event is the free time's end
                        new_end = free_end
                        # The new start of the event is the new end minus the length
                        new_start = subtract_times(new_end, event_length)
                        # Update free_time
                        if event_length == free_length:
                            free_time.pop(free_start)
                        else:
                            free_time[free_start] = new_start
                        break
                    # If all else fails...
                    elif overlaps_right(event_start, event_end, free_start, free_end) or priority == 1:
                        # The new start of the event is the start of free time
                        new_start = free_start
                        # The new end of the event is the new start plus the length of the evnt
                        new_end = add_times(new_start, event_length)
                        # Update free_time
                        if event_length != free_length:
                            free_time[new_end] = free_time[free_start]
                        free_time.pop(free_start)
                        break
            elif free_time_count == len(free_time):
                leftovers.append(event)
        # Update database with new values
        if priority != 3:
            exec_commit(f"UPDATE {EVENT_TABLE} SET {START_TIME} = '{new_start}', {END_TIME} = '{new_end}' WHERE {ID} = {event[0]};")
    if priority == 3:
        return [earliest, latest]
    return leftovers

def during_event(event_frame, free_frame, free_time):
    """This function checks if the event passed in is in between the free time frame
    passed in and the free time frame ahead of it. By determining this,
    the function confirms that the event time frame passed in takes place during an
    event who's time frame was already established before this event.

    Args:
        event_frame (list): 0 index being start, 1 index being end of event time frame
        free_frame (list): 0 index being start, 1 index being end of free time frame
        free_time (dict): The dictionary of start:end time frames for the free time available

    Returns:
        list: 0 index being boolean of whether or not the event overlaps an event
        1 index being the end time of the overlapped event
    """
    # Get the free time that is after this free time passed in
    starts = list(free_time.keys())
    ends = list(free_time.values())
    starts.sort(key=get_total_minutes)
    ends.sort(key=get_total_minutes)
    overlapped_event_start = free_frame[1]
    # Get index in ends of free_frame's value at [1]
    index = ends.index(overlapped_event_start)
    # Use this to get the start after this
    try:
        overlapped_event_end = starts[index+1]
        # If the event is overlapping the middle of the time frame between the current end and the next start...
        # return True
        return [overlaps_middle(event_frame[0], event_frame[1], overlapped_event_start, overlapped_event_end), overlapped_event_end]
    except IndexError:
        return [False]

def overlaps_left(this_start, this_end, that_start, that_end):
    """Determines whether or not "this" time frame overlaps "that" time frame on "this'" left side.
    In short, this function determines if "this" overlaps "that" to the left.

    Args:
        this_start (str): The start of "this" time frame
        this_end (str): The end of "this" time frame
        that_start (str): The start of "that" time frame
        that_end (str): The end of "that" time frame

    Returns:
        bool: True if "this" overlaps "that" to the left, False otherwise.
    """
    return time_is_greater(this_start, that_start) and time_is_greater(this_end, that_end) and time_is_greater(that_end, this_start)

def overlaps_right(this_start, this_end, that_start, that_end):
    """Determines whether or not "this" time frame overlaps "that" time frame on "this'" right side.
    In short, this function determines if "this" overlaps "that" to the right.

    Args:
        this_start (str): The start of "this" time frame
        this_end (str): The end of "this" time frame
        that_start (str): The start of "that" time frame
        that_end (str): The end of "that" time frame

    Returns:
        bool: True if "this" overlaps "that" to the right, False otherwise.
    """
    return time_is_greater(that_end, this_end) and time_is_greater(that_start, this_start) and time_is_greater(this_end, that_start)

def overlaps_middle(this_start, this_end, that_start, that_end):
    """Determines whether or not "this" time frame overlaps "that" time frame directly in the middle.
    In short, this function determines if "this" overlaps "that" entirely.

    Args:
        this_start (str): The start of "this" time frame
        this_end (str): The end of "this" time frame
        that_start (str): The start of "that" time frame
        that_end (str): The end of "that" time frame

    Returns:
        bool: True if "this" overlaps "that", False otherwise.
    """
    return time_is_greater(this_start, that_start, True) and time_is_greater(that_end, this_end, True)

def overlaps_at_all(this_start, this_end, that_start, that_end):
    """Determines whether or not "this" time frame overlaps "that" time frame in any shape or form.
    In short, this function determines if "this" overlaps "that" at all: left, right, or middle side.

    Args:
        this_start (str): The start of "this" time frame
        this_end (str): The end of "this" time frame
        that_start (str): The start of "that" time frame
        that_end (str): The end of "that" time frame

    Returns:
        bool: True if "this" overlaps "that" at all, False otherwise.
    """
    return overlaps_left(this_start, this_end, that_start, that_end) or overlaps_right(this_start, this_end, that_start, that_end) or overlaps_middle(this_start, this_end, that_start, that_end)

def add_times(start, length):
    """Taking a starting time and the length of the time frame, this function adds these
    two and returns the result. This also works for any two kinds of time frames, but for 
    this scenerio, the starting time and the length of the time frame.

    Args:
        start (str): The starting time
        length (str): The length of the time frame

    Returns:
        str: The final time, and the result of the addition
    """
    new_hr = int(start.split(':')[0]) + int(length.split(':')[0])
    new_min = int(start.split(':')[1]) + int(length.split(':')[1])
    if new_min >= 60:
        new_hr += math.floor(new_min / 60)
        new_min = new_min % 60
    if new_min < 10:
        new_min = f"0{new_min}"
    new_end = f"{new_hr}:{new_min}"
    return new_end

def subtract_times(end, length):
    """Taking an ending time and the length of the time frame, this function subtracts these
    two and returns the result. This also works for any two kinds of time frames, but for 
    this scenerio, the ending time and the length of the time frame.

    Args:
        end (str): The ending time
        length (str): The length of the time frame

    Returns:
        str: The final time, and the result of the subtraction
    """
    new_hr = int(end.split(':')[0]) - int(length.split(':')[0])
    new_min = int(end.split(':')[1]) - int(length.split(':')[1])
    if new_min < 0:
        new_hr -= math.floor(-new_min / 60) + 1
        new_min = 60 - (new_min % 60)
    if new_min < 10:
        new_min = f"0{new_min}"
    new_start = f"{new_hr}:{new_min}"
    return new_start

def get_total_minutes(e):
    """Helper function that gives the total amount of minutes for a time given

    Args:
        e (str): The time

    Returns:
        int: The total minutes of the time
    """
    e_split = e.split(':')
    hr = int(e_split[0])
    if hr < 0:
        hr += -2*hr
    min = int(e_split[1])
    return (hr*60) + min 

def length_between_times(this, that):
    """Subtracts "that" from "this" and returns the result, which is the 
    length between both times

    Args:
        this (str): The time desired to find the distance of
        that (str): The other time that is desired to find the length of

    Returns:
        str: The distance between the two times passed in
    """
    this_split = this.split(':')
    that_split = that.split(':')
    hr = int(this_split[0]) - int(that_split[0])
    min = int(this_split[1]) - int(that_split[1])
    total_min = (hr*60) + min
    if total_min < 0:
        total_min = -total_min
    new_min = total_min % 60
    if new_min < 10:
        new_min = f"0{new_min}"
    return f"{math.floor(total_min/60)}:{new_min}"

def time_is_greater(a, b, or_equal=False):
    """Determines if one time, a, is greater than the other time, b. Will also
    determine of one is greater than or equal to the other by passing in "True"
    for "or_equal".

    Args:
        a (str): The time the user wants to determine is greater than the other
        b (str): The time the user wants to determine is less than the other
        or_equal (bool, optional): When passed in as True, the function returns if
        a is greater than or equal to b. Defaults to False.

    Returns:
        bool: True if a > b, False otherwise.
    """
    a_split = a.split(":")
    b_split = b.split(":")
    a_hour = int(a_split[0])
    a_minute = int(a_split[1])
    b_hour = int(b_split[0])
    b_minute = int(b_split[1])
    if(or_equal):
        return (a_hour > b_hour) or (a_hour == b_hour and a_minute >= b_minute)
    return (a_hour > b_hour) or (a_hour == b_hour and a_minute > b_minute)

def initialize_days(u_id):
    """Helper function that initializes the 'days' data structure
    for the optimize_calendar function

    Args:
        u_id (int): The id of the user to grab their events

    Returns:
        list: A list of lists which contains data structures that separate
        each event by their priority level
    """
    days = [[], [], [], [], [], [], []]
    for i in range(len(days)):
        days[i].append(exec_get_all(f"SELECT * FROM {EVENT_TABLE} WHERE {U_ID} = {u_id} AND {DAY_ID} = {i+1} AND {EVENT_PRIORITY} = 3;")),
        days[i].append(exec_get_all(f"SELECT * FROM {EVENT_TABLE} WHERE {U_ID} = {u_id} AND {DAY_ID} = {i+1} AND {EVENT_PRIORITY} = 2 AND {EVENT_NAME} != 'Sleep';"))
        days[i].append(exec_get_all(f"SELECT * FROM {EVENT_TABLE} WHERE {U_ID} = {u_id} AND {DAY_ID} = {i+1} AND {EVENT_PRIORITY} = 1;"))
    return days

def get_meal_frame(meal):
    """Helper function that, given a meal's name, returns the corresponding
    time frame.

    Args:
        meal (str): The name of the desired time frame

    Returns:
        list: Index 0 being the start of the time frame, and 1 being the end.
    """
    if meal == 'Breakfast':
        return BREAKFAST_FRAME
    elif meal == 'Lunch':
        return LUNCH_FRAME
    elif meal == 'Dinner':
        return DINNER_FRAME

def get_day_by_id(day_id):
    """Helper function that, given a day id, returns the string of the day
    that was desired.

    Args:
        day_id (int): The id of the day
    Returns:
        str: The string of the corresponding day
    """
    if day_id == 1:
        return SUNDAY
    elif day_id == 2:
        return MONDAY
    elif day_id == 3:
        return TUESDAY
    elif day_id == 4:
        return WEDNESDAY
    elif day_id == 5:
        return THURSDAY
    elif day_id == 6:
        return FRIDAY
    elif day_id == 7:
        return SATURDAY

def default_user_calendar(u_id):
    """When creating a user, this function is called to initialize a bare-bones calendar
    for the user to add whatever events they want to it.

    Args:
        u_id (int): The id of the user that was created.
    """
    exec = f"INSERT INTO {EVENT_TABLE}({EVENT_NAME}, {EVENT_TYPE}, {EVENT_PRIORITY}, {START_TIME}, {END_TIME}, {U_ID}, {DAY_ID}) VALUES "
    for i in range(1, 8):
        exec += f"('Breakfast', 'special', 2, '7:15', '7:45', {u_id}, {i}), "
        exec += f"('Lunch', 'special', 2, '12:15', '12:45', {u_id}, {i}), "
        exec += f"('Dinner', 'special', 2, '17:15', '17:45', {u_id}, {i}), "
        exec += f"('Sleep', 'special', 2, '23:00', '7:00', {u_id}, {i})"
        if i == 7:
            exec += ";"
        else:
            exec += ", "
    exec_commit(exec)

def create_homework_event(event_name, end_time, u_id, day_id):
    """Given a couple of instances of a class event, this function inserts a brand new, 
    low priority event dedicated to homework that is 15 minutes after the class and is only
    half an hour long.

    Args:
        event_name (str): The name of the class event
        end_time (str): The time that the class event ends, format hh:mm
        u_id (int): The ID of the user creating the class event
        day_id (int): The id of the day that the class event takes place
    Returns:
        tuple: The homework event in perfect formatting for adding to the database
    """
    homework_name = event_name + " Homework"
    homework_start_time = add_times(end_time, "00:15")
    homework_end_time = add_times(homework_start_time, '00:30')
    return (homework_name, 'school', 1, homework_start_time, homework_end_time, u_id, day_id, "")

def overlaps_high_priority(u_id, day_id, start_time, end_time, event_id=None):
    """Helper function that checks all of the high priority events in the day
    and if the starting and end time passed in overlaps this event.

    Args:
        u_id (int): ID of the user
        day_id (int): ID of the day that's being checked
        start_time (str): The start time of the event being checked, format hh:mm
        end_time (str): The end time of the event being checked, format hh:mm
        event_id (int): The event that is being checked if it overlaps itself, is passed in
        only if the event is already in the table

    Returns:
        bool: True if overlaps, False otherwise
    """
    if event_id:
        events = exec_get_all(f"SELECT * FROM {EVENT_TABLE} WHERE {U_ID} = {u_id} AND {DAY_ID} = {day_id} AND {EVENT_PRIORITY} = 3 AND {ID} != {event_id};")
    else:
        events = exec_get_all(f"SELECT * FROM {EVENT_TABLE} WHERE {U_ID} = {u_id} AND {DAY_ID} = {day_id} AND {EVENT_PRIORITY} = 3;")
    for high_priority in events:
        high_priority_start = high_priority[4]
        high_priority_end = high_priority[5]
        if overlaps_at_all(start_time, end_time, high_priority_start, high_priority_end):
            return True
    return False