from ..db.db_utils import *
from ..constants import *

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
        for id in events:
            event = exec_get_one(f"SELECT * FROM {EVENT_TABLE} WHERE {ID} = {int(id)};")
            if event[3] == 3:
                event_start = event[4]
                event_end = event[5]
                for start in free_time:
                    end = free_time[start]
                    if overlaps_middle(event_start, event_end, start, end):
                        free_time[start] = event_start
                        free_time[event_end] = end
                        break
            elif event[1] == 'Sleep':
                sleep[event_start] = event_end
            elif event[3] == 2:
                medium_priorities.append(event)
            else:
                low_priorities.append(event)
            day.append(event)
        i += 1
        if len(low_priorities) != 0:
            for low_priority in low_priorities:
                event_start = low_priority[4]
                event_end = low_priority[5]
                event_hr_len = int(event_end.split(':')[0]) - int(event_start.split(':')[0])
                event_min_len = int(event_end.split(':')[1]) - int(event_start.split(':')[1])
                for free_start in free_time:
                    free_end = free_time[free_start]
                    free_hr_len = int(free_end.split(':')[0]) - int(free_start.split(':')[0])
                    free_min_len = int(free_end.split(':')[1]) - int(free_start.split(':')[1])
                    if time_is_greater(f"{free_hr_len}:{free_min_len}", f"{event_hr_len}:{event_min_len}", True):
                        new_start = event_start
                        new_end = event_end
                        if overlaps_left(event_start, event_end, free_start, free_end):
                            new_start = free_end
                            new_end = f"{int(free_end.split(':')[0]) + event_hr_len}:{int(free_end.split(':')[1]) + event_min_len}"
                            free_time[free_start] = new_end
                        elif overlaps_right(event_start, event_end, free_start, free_end):
                            new_end = free_start
                            new_start = f"{int(free_start.split(':')[0]) - event_hr_len}:{int(free_start.split(':')[1]) - event_min_len}"
                            free_time[new_start] = free_end
                            free_time.pop(free_start)
                        exec_commit(f"UPDATE {EVENT_TABLE} SET {START_TIME} = '{new_start}', {END_TIME} = '{new_end}' WHERE {id} = {event[0]};")
                        break

def overlaps_left(this_start, this_end, that_start, that_end):
    return time_is_greater(this_start, that_start) and time_is_greater(this_end, that_end)

def overlaps_right(this_start, this_end, that_start, that_end):
    return time_is_greater(that_end, this_end) and time_is_greater(that_start, this_start)

def overlaps_middle(this_start, this_end, that_start, that_end):
    return time_is_greater(this_start, that_start) and time_is_greater(that_end, this_end)

def overlaps_all(this_start, this_end, that_start, that_end):
    return time_is_greater(that_start, this_start) and time_is_greater(this_end, that_end)

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