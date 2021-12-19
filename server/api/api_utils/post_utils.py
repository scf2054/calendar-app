from ..db.db_utils import *
from ..constants import *
import math

def optimize_calendar(calendar):
    u_id = calendar[1]
    i = 2
    while i < len(calendar):
        day = []
        free_time = {'0:00': '23:59'}
        sleep = {}
        low_priorities = []
        medium_priorities = []
        events = calendar[i].split(",")
        earliest = '23:59'
        latest = '00:00'
        for id in events:
            event = exec_get_one(f"SELECT * FROM {EVENT_TABLE} WHERE {ID} = {int(id)};")
            event_start = event[4]
            event_end = event[5]
            priority = event[3]
            if priority == 3:
                for start in free_time:
                    end = free_time[start]
                    if overlaps_middle(event_start, event_end, start, end):
                        free_time[start] = event_start
                        free_time[event_end] = end
                        if time_is_greater(earliest, event_start):
                            earliest = event_start
                        if time_is_greater(event_end, latest):
                            latest = event_end
                        break
            elif event[1] == 'Sleep' and priority == 2:
                sleep[event_start] = event_end
            elif priority == 2:
                medium_priorities.append(event)
            else:
                low_priorities.append(event)
            day.append(event)
        i += 1
        free_time.pop('0:00')
        bedtime = list(sleep.keys())[0]
        free_time[sleep[bedtime]] = earliest
        free_time[latest] = bedtime
        if len(low_priorities) != 0:
            optimize_priorities(low_priorities, free_time)

def optimize_priorities(priorities, free_time):
    for priority in priorities:
        event_start = priority[4]
        event_end = priority[5]
        event_length = length_between_times(event_end, event_start)
        event_hr_len = int(event_length.split(':')[0])
        event_min_len = int(event_length.split(':')[1])
        for free_start in free_time:
            free_end = free_time[free_start]
            free_length = length_between_times(free_end, free_start)
            free_greater_than_event = time_is_greater(free_length, event_length, True)
            if free_greater_than_event:
                new_start = free_start
                new_min = int(free_start.split(':')[1]) + event_min_len
                if new_min < 10:
                    new_min = f"0{new_min}"
                new_end = f"{int(free_start.split(':')[0]) + event_hr_len}:{new_min}"
                free_time[new_end] = free_time[free_start]
                free_time.pop(free_start)
                exec_commit(f"UPDATE {EVENT_TABLE} SET {START_TIME} = '{new_start}', {END_TIME} = '{new_end}' WHERE {ID} = {priority[0]};")
                break

def overlaps_left(this_start, this_end, that_start, that_end):
    return time_is_greater(this_start, that_start) and time_is_greater(this_end, that_end) and time_is_greater(that_end, this_start)

def overlaps_right(this_start, this_end, that_start, that_end):
    return time_is_greater(that_end, this_end) and time_is_greater(that_start, this_start) and time_is_greater(this_end, that_start)

def overlaps_middle(this_start, this_end, that_start, that_end):
    return time_is_greater(this_start, that_start) and time_is_greater(that_end, this_end)

def overlaps_at_all(this_start, this_end, that_start, that_end):
    return overlaps_left(this_start, this_end, that_start, that_end) or overlaps_right(this_start, this_end, that_start, that_end) or overlaps_middle(this_start, this_end, that_start, that_end)

def length_between_times(this, that):
    this_split = this.split(':')
    that_split = that.split(':')
    hr = int(this_split[0]) - int(that_split[0])
    if hr < 0:
        hr += -2*hr
    min = int(this_split[1]) - int(that_split[1])
    total_min = (hr*60) + min
    return f"{math.floor(total_min/60)}:{total_min % 60}"

def time_is_greater(a, b, equal=False):
    a_split = a.split(":")
    b_split = b.split(":")
    a_hour = int(a_split[0])
    a_minute = int(a_split[1])
    b_hour = int(b_split[0])
    b_minute = int(b_split[1])
    if(equal):
        return (a_hour >= b_hour) or (a_hour == b_hour and a_minute >= b_minute)
    return (a_hour > b_hour) or (a_hour == b_hour and a_minute > b_minute)

def default_user_calendar(id):
    # Get all of the special events' id's
    components = f"({U_ID}, {SUNDAY}, {MONDAY}, {TUESDAY}, {WEDNESDAY}, {THURSDAY}, {FRIDAY}, {SATURDAY})"
    values = f"({id}, '1,2,3,4', '1,2,3,4', '1,2,3,4', '1,2,3,4', '1,2,3,4', '1,2,3,4', '1,2,3,4')"
    exec_commit(f"INSERT INTO {CALENDAR_TABLE}{components} VALUES {values};")