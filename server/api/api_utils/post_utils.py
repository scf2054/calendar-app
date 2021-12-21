from ..db.db_utils import *
from ..constants import *
import math

BREAKFAST_FRAME = ['7:00', '12:00']
LUNCH_FRAME = ['11:00', '16:00']
DINNER_FRAME = ['15:00', '20:00']

def optimize_calendar(calendar):
    """Given a calendar from the database, this function iterates over every single id
    in every single day of the week and optimizes it based on sleep, meals, calsses,
    work, and everything that was added by the user.

    Args:
        calendar (tuple): The calendar that was grabbed by the database.
    """
    i = 2
    while i < len(calendar):
        # Initialize all data that will be used
        sleep = {}
        low_priorities = []
        medium_priorities = []
        high_priorities = []
        free_time = {'0:00': '23:59'}
        events = calendar[i].split(",")
        # For every id in the calendar day...
        for id in events:
            event = exec_get_one(f"SELECT * FROM {EVENT_TABLE} WHERE {ID} = {int(id)};")
            # Get the start, end, and priority level of the event
            event_start = event[4]
            event_end = event[5]
            priority = event[3]
            # If the priority is at its highest...
            if priority == 3:
                # Add this to the high priority list
                high_priorities.append(event)
            # If the event is a sleep event...
            elif event[1] == 'Sleep' and priority == 2:
                # Initialize this in the sleep structure initialized before
                sleep[event_start] = event_end
            # If the event is of medium priority...
            elif priority == 2:
                # Add this to the medium priority list
                medium_priorities.append(event)
            else:
                # Otherwise, add it to the lowest priorities list
                low_priorities.append(event)
        # Optimize the highest priority group to get the earliest and latest times
        earliest_latest = optimize_priority_group(high_priorities, free_time, 3)
        # Add the sleep schedule to free time...
        # Remove the value at '0:00' which should be stored in the 'earliest' variable already
        free_time.pop('0:00')
        bedtime = list(sleep.keys())[0]
        # The value at sleep's end should now be the earliest time
        free_time[sleep[bedtime]] = earliest_latest[0]
        # The value at the latest all events go should now be the bedtime
        free_time[earliest_latest[1]] = bedtime
        optimize_priority_group(medium_priorities, free_time, 2)
        optimize_priority_group(low_priorities, free_time, 1)
        i += 1
        print("Finished day!")
    print("finished")

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
    # For each event in priorities...
    for event in priority_group:
        # Get the starting and ending time
        meal_frame = get_meal_frame(event[1])
        event_start = event[4]
        event_end = event[5]
        optimized = False
        # For each time frame in free time...
        for free_start in free_time:
            free_end = free_time[free_start]
            # Check if the free time is in the desired meal time frame, if not coninue
            if priority == 2:
                if not overlaps_at_all(free_start, free_end, meal_frame[0], meal_frame[1]):
                    continue
            # Calculate the length of the event and free time
            event_length = length_between_times(event_start, event_end)
            free_length = length_between_times(free_start, free_end)
            # As long as the length of free time is greater than or equal to the event...
            if time_is_greater(free_length, event_length, True):
                is_during_event = during_event([event_start, event_end], [free_start, free_end], free_time)
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
                # If the event overlaps an event that's already there...
                elif is_during_event[0] and priority != 3:
                    overlapped_event_end = is_during_event[1]
                    # Calculate distance between right side and left side
                    length_of_left_side = length_between_times(event_start, free_end)
                    length_of_right_side = length_between_times(event_end, overlapped_event_end)
                    # If distance is shorter on left side...
                    if time_is_greater(length_of_right_side, length_of_left_side, True):
                        # Set new start/end
                        new_end = free_end
                        new_start = subtract_times(new_end, event_length)
                        optimized = True
                    # If distance is shorter on right side and the free time frame length on the right side is greater than the event's...
                    else:
                        free_after_overlapped_end = free_time[overlapped_event_end]
                        free_after_length = length_between_times(overlapped_event_end, free_after_overlapped_end)
                        if time_is_greater(free_after_length, event_length, True):
                            # Set new start/end
                            new_start = overlapped_event_end
                            new_end = add_times(new_start, event_length)
                            optimized = True
                # If the event overlaps to the left of a free time
                elif overlaps_left(event_start, event_end, free_start, free_end) and priority != 3:
                    # The new end of the event is the free time's end
                    new_end = free_end
                    # The new start of the event is the new end minus the length
                    new_start = subtract_times(new_end, event_length)
                    optimized = True
                # If the event overlaps to the right of a free time
                elif overlaps_right(event_start, event_end, free_start, free_end) and priority != 3:
                    # The new start of the event is the start of free time
                    new_start = free_start
                    # The new end of the event is the new start plus the length of the evnt
                    new_end = add_times(new_start, event_length)
                    optimized = True
                if optimized:
                    # If the length of the free time is equal to that of the event length...
                    if event_length == free_length:
                        # Remove this free time from the dictionary entirely
                        free_time.pop(free_start)
                    # Otherwise
                    else:
                        # Shorten the free time
                        free_time[free_start] = new_start
                    break
    if priority == 3:
        return [earliest, latest]

def during_event(event_frame, free_frame, free_time):
    """This function checks if the event passed in is in between the free time frame
    passed in and the free time frame ahead of the free time frame. By determining this,
    the function confirms that the event time frame passed in takes place during and
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
        print("Event is during sleep schedule")
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

def default_user_calendar(id):
    """When creating a user, this function is called to initialize a bare-bones calendar
    for the user to add whatever events they want to it.

    Args:
        id (int): The id of the user that was created.
    """
    # Get all of the special events' id's
    components = f"({U_ID}, {SUNDAY}, {MONDAY}, {TUESDAY}, {WEDNESDAY}, {THURSDAY}, {FRIDAY}, {SATURDAY})"
    values = f"({id}, '1,2,3,4', '1,2,3,4', '1,2,3,4', '1,2,3,4', '1,2,3,4', '1,2,3,4', '1,2,3,4')"
    exec_commit(f"INSERT INTO {CALENDAR_TABLE}{components} VALUES {values};")

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