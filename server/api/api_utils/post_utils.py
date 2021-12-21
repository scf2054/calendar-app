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
        optimize_medium_priorities(medium_priorities, free_time)
        i += 1
    print("finished")

def optimize_medium_priorities(medium_priorities, free_time):
    # For each medium priority...
    for event in medium_priorities:
        # Get the starting and ending time
        event_start = event[4]
        event_end = event[5]
        # For each time frame in free time...
        for free_start in free_time:
            free_end = free_time[free_start]
            # If the event takes place during free time...
            if overlaps_middle(event_start, event_end, free_start, free_end):
                # Change the free time and leave the time frame alone
                free_time[free_start] = event_start
                free_time[event_end] = free_end
                break
            # Calculate the length of the event and free time
            event_length = length_between_times(event_start, event_end)
            free_length = length_between_times(free_start, free_end)
            # If the event overlaps to the left of a free time and the length of the free time is greater than or equal to that of the event...
            if overlaps_left(event_start, event_end, free_start, free_end) and time_is_greater(free_length, event_length, True):
                # The new end of the event is the free time's end
                new_end = free_end
                # The new start of the event is the new end minus the length
                new_start = subtract_times(new_end, event_length)
                # If the length of the free time is equal to that of the event length...
                if event_length == free_length:
                    # Remove this free time from the dictionary entirely
                    free_time.pop(free_start)
                # Otherwise
                else:
                    # Shorten the free time
                    free_time[free_start] = new_start
                break
            # If the event overlaps to the right of a free time and the length of the free time is greater than or equal to that of the event...
            elif overlaps_right(event_start, event_end, free_start, free_end) and time_is_greater(free_length, event_length, True):
                # The new start of the event is the start of free time
                new_start = free_start
                # The new end of the event is the new start plus the length of the evnt
                new_end = add_times(new_start, event_length)

def optimize_priorities(all_events, priorities, free_time, day_id, cal_id):
    for priority in priorities:
        event_start = priority[4]
        event_end = priority[5]
        event_length = length_between_times(event_end, event_start)
        is_during_event = in_between_events(free_time, priority, event_length)
        if is_during_event[0]:
            update_times(is_during_event[1], priority, all_events, event_length, free_time, day_id, cal_id)
            continue
        for free_start in free_time:
            free_end = free_time[free_start]
            free_length = length_between_times(free_end, free_start)
            free_greater_than_event = time_is_greater(free_length, event_length, True)
            if free_greater_than_event:
                update_times(free_start, priority, all_events, event_length, free_time, day_id, cal_id)
                break

def overlaps_left(this_start, this_end, that_start, that_end):
    return time_is_greater(this_start, that_start) and time_is_greater(this_end, that_end) and time_is_greater(that_end, this_start)

def overlaps_right(this_start, this_end, that_start, that_end):
    return time_is_greater(that_end, this_end) and time_is_greater(that_start, this_start) and time_is_greater(this_end, that_start)

def overlaps_middle(this_start, this_end, that_start, that_end):
    return time_is_greater(this_start, that_start) and time_is_greater(that_end, this_end)

def overlaps_at_all(this_start, this_end, that_start, that_end):
    return overlaps_left(this_start, this_end, that_start, that_end) or overlaps_right(this_start, this_end, that_start, that_end) or overlaps_middle(this_start, this_end, that_start, that_end)

def update_times(new_start, event, all_events, event_length, time_frames, day_id, cal_id):
    new_end = add_times(new_start, event_length)
    time_frames[new_end] = time_frames[new_start]
    time_frames.pop(new_start)
    if event[2] == 'special':
        special_event = exec_get_one(f"SELECT * FROM {EVENT_TABLE} WHERE {EVENT_NAME} = '{event[1]}' AND {EVENT_TYPE} = 'special' AND {EVENT_PRIORITY} = 2 AND {START_TIME} = '{new_start}' AND {END_TIME} = '{new_end}';")
        if not special_event:
            exec_commit(f"INSERT INTO {EVENT_TABLE}({EVENT_NAME}, {EVENT_TYPE}, {EVENT_PRIORITY}, {START_TIME}, {END_TIME}) VALUES ('{event[1]}', 'special', 2, '{new_start}', '{new_end}');")
            special_event = exec_get_one(f"SELECT * FROM {EVENT_TABLE} WHERE {EVENT_NAME} = '{event[1]}' AND {EVENT_TYPE} = 'special' AND {EVENT_PRIORITY} = 2 AND {START_TIME} = '{new_start}' AND {END_TIME} = '{new_end}';")
        new_events = ""
        for event_id in all_events:
            the_event = exec_get_one(f"SELECT * FROM {EVENT_TABLE} WHERE {ID} = {event_id};")
            if the_event[1] != special_event[1]:
                new_events += event_id + ","
        new_events += str(special_event[0])
        exec_commit(f"UPDATE {CALENDAR_TABLE} SET {get_day_by_id(day_id)} = '{new_events}' WHERE id = {cal_id};")
    else:
        exec_commit(f"UPDATE {EVENT_TABLE} SET {START_TIME} = '{new_start}', {END_TIME} = '{new_end}' WHERE {ID} = {event[0]};")

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

def in_between_events(time_frames, event, event_length):
    starts = list(time_frames.keys())
    ends = list(time_frames.values())
    starts.sort(key=get_total_minutes)
    ends.sort(key=get_total_minutes)
    event_start = event[4]
    event_end = event[5]
    i = 0
    while i < len(starts):
        j = i-1
        that_start = ends[j]
        that_end = starts[i]
        if i == 0:
            that_start = '0:00'
        in_between = overlaps_middle(event_start, event_end, that_start, that_end)
        if(in_between):
            checks = 0
            while checks < len(starts):
                len_in_front = length_between_times(starts[i], ends[i])
                len_in_back = length_between_times(starts[j], ends[j])
                if event[2] == 'special' and event[1] != 'Sleep':
                    if event[1] == 'Breakfast':
                        meal_frame = BREAKFAST_FRAME
                    elif event[1] == 'Lunch':
                        meal_frame = LUNCH_FRAME
                    elif event[1] == 'Dinner':
                        meal_frame == DINNER_FRAME

                    if time_is_greater(len_in_front, event_length) and overlaps_at_all(starts[i], ends[i], meal_frame[0], meal_frame[1]):
                        return [True, starts[i]]
                    elif time_is_greater(len_in_back, event_length) and overlaps_at_all(starts[j], ends[j], meal_frame[0], meal_frame[1]):
                        return [True, starts[j]]
                else:
                    if time_is_greater(len_in_front, event_length):
                        return [True, starts[i]]
                    elif time_is_greater(len_in_back, event_length):
                        return [True, starts[j]]
                checks += 1
                i += 1
                j -= 1
        i += 1
    return [False]

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

def time_is_greater(a, b, equal=False):
    a_split = a.split(":")
    b_split = b.split(":")
    a_hour = int(a_split[0])
    a_minute = int(a_split[1])
    b_hour = int(b_split[0])
    b_minute = int(b_split[1])
    if(equal):
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