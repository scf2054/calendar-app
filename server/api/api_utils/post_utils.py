from ..db.db_utils import *
from ..constants import *
import math

def optimize_calendar(calendar):
    i = 2
    while i < len(calendar):
        sleep = {}
        low_priorities = []
        medium_priorities = []
        free_time = {'0:00': '23:59'}
        earliest = '23:59'
        latest = '00:00'
        events = calendar[i].split(",")
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
        i += 1
        free_time.pop('0:00')
        bedtime = list(sleep.keys())[0]
        free_time[sleep[bedtime]] = earliest
        free_time[latest] = bedtime
        optimize_priorities(events, medium_priorities, free_time, i, calendar[0])
        if len(low_priorities) != 0:
            optimize_priorities(events, low_priorities, free_time, i, calendar[0])
        print("finished")

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
        exec_commit(f"INSERT INTO {EVENT_TABLE}({EVENT_NAME}, {EVENT_TYPE}, {EVENT_PRIORITY}, {START_TIME}, {END_TIME}) VALUES ('{event[1]}', 'special', 2, '{new_start}', '{new_end}');")
        new_events = ""
        for event_id in all_events:
            if int(event_id) != event[0]:
                new_events += event_id + ","
        event = exec_get_one(f"SELECT * FROM {EVENT_TABLE} WHERE {EVENT_NAME} = '{event[1]}' AND {EVENT_TYPE} = 'special' AND {EVENT_PRIORITY} = 2 AND {START_TIME} = '{new_start}' AND {END_TIME} = '{new_end}';")
        new_events += str(event[0])
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