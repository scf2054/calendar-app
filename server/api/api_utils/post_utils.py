from ..db.db_utils import *
from ..constants import *
import math

BREAKFAST_FRAME = ['7:00', '12:00']
LUNCH_FRAME = ['11:00', '4:00']
DINNER_FRAME = ['3:00', '8:00']

def optimize_calendar(calendar):
    i = 2
    while i < len(calendar):
        # Initialize all data that will be used
        sleep = {}
        low_priorities = []
        medium_priorities = []
        free_time = {'0:00': '23:59'}
        earliest = '23:59'
        latest = '00:00'
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
                # Fit this event into free time
                for start in free_time:
                    end = free_time[start]
                    # If the event is in the middle of a certain free time frame...
                    if overlaps_middle(event_start, event_end, start, end):
                        # The original start of free time has an end that is the start of this event
                        free_time[start] = event_start
                        # A new start to free time is the end of this event, and its end is the original time frame's end
                        free_time[event_end] = end
                        if time_is_greater(earliest, event_start):
                            earliest = event_start
                        if time_is_greater(event_end, latest):
                            latest = event_end
                        break
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
        # Add the sleep schedule to free time...
        # Remove the value at '0:00' which should be stored in the 'earliest' variable already
        free_time.pop('0:00')
        bedtime = list(sleep.keys())[0]
        # The value at sleep's end should now be the earliest time
        free_time[sleep[bedtime]] = earliest
        # The value at the latest all events go should now be the bedtime
        free_time[latest] = bedtime
        optimize_priority_group(medium_priorities, free_time)
        i += 1
    print("finished")

def optimize_priority_group(medium_priorities, free_time):
    # For each medium priority...
    for event in medium_priorities:
        # Get the starting and ending time
        event_start = event[4]
        event_end = event[5]
        optimized = False
        # For each time frame in free time...
        for free_start in free_time:
            free_end = free_time[free_start]
            # Calculate the length of the event and free time
            event_length = length_between_times(event_start, event_end)
            free_length = length_between_times(free_start, free_end)
            # As long as the length of free time is greater than or equal to the event...
            if time_is_greater(free_length, event_length, True):
                # If the event takes place during free time...
                if overlaps_middle(event_start, event_end, free_start, free_end):
                    # Change the free time and leave the time frame alone
                    free_time[free_start] = event_start
                    free_time[event_end] = free_end
                    break
                # If the event overlaps to the left of a free time
                if overlaps_left(event_start, event_end, free_start, free_end):
                    # The new end of the event is the free time's end
                    new_end = free_end
                    # The new start of the event is the new end minus the length
                    new_start = subtract_times(new_end, event_length)
                    optimized = True
                # If the event overlaps to the right of a free time
                elif overlaps_right(event_start, event_end, free_start, free_end):
                    # The new start of the event is the start of free time
                    new_start = free_start
                    # The new end of the event is the new start plus the length of the evnt
                    new_end = add_times(new_start, event_length)
                    optimized = True
                # If the event overlaps an event that's already there...
                elif during_event([event_start, event_end], [free_start, free_end], free_time):
                    pass
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

def during_event(event_frame, free_frame, free_time):
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
        return overlaps_middle_exactly(event_frame[0], event_frame[1], overlapped_event_start, overlapped_event_end)
    except:
        print("Event is during sleep schedule")
        return False

def overlaps_left(this_start, this_end, that_start, that_end):
    return time_is_greater(this_start, that_start) and time_is_greater(this_end, that_end) and time_is_greater(that_end, this_start)

def overlaps_right(this_start, this_end, that_start, that_end):
    return time_is_greater(that_end, this_end) and time_is_greater(that_start, this_start) and time_is_greater(this_end, that_start)

def overlaps_middle(this_start, this_end, that_start, that_end):
    return time_is_greater(this_start, that_start) and time_is_greater(that_end, this_end)

def overlaps_middle_exactly(this_start, this_end, that_start, that_end):
    return time_is_greater(this_start, that_start, True) and time_is_greater(that_end, this_end, True)

def overlaps_at_all(this_start, this_end, that_start, that_end):
    return overlaps_left(this_start, this_end, that_start, that_end) or overlaps_right(this_start, this_end, that_start, that_end) or overlaps_middle(this_start, this_end, that_start, that_end)

def add_times(start, length):
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
    new_hr = int(end.split(':')[0]) - int(length.split(':')[0])
    new_min = int(end.split(':')[1]) - int(length.split(':')[1])
    if new_min < 0:
        new_hr -= math.floor(-new_min / 60) + 1
        new_min = 60 + (new_min % 60)
    if new_min < 10:
        new_min = f"0{new_min}"
    new_start = f"{new_hr}:{new_min}"
    return new_start

def get_total_minutes(e):
    e_split = e.split(':')
    hr = int(e_split[0])
    if hr < 0:
        hr += -2*hr
    min = int(e_split[1])
    return (hr*60) + min 

def length_between_times(this, that):
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
    # Get all of the special events' id's
    components = f"({U_ID}, {SUNDAY}, {MONDAY}, {TUESDAY}, {WEDNESDAY}, {THURSDAY}, {FRIDAY}, {SATURDAY})"
    values = f"({id}, '1,2,3,4', '1,2,3,4', '1,2,3,4', '1,2,3,4', '1,2,3,4', '1,2,3,4', '1,2,3,4')"
    exec_commit(f"INSERT INTO {CALENDAR_TABLE}{components} VALUES {values};")

def get_day_by_id(day_id):
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