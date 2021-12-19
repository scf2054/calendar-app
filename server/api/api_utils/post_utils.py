from ..db.db_utils import *
from ..constants import *

def optimize_calendar(calendar):
    u_id = calendar[1]
    i = 2
    while i < len(calendar):
        day = []
        free_time = {'0:00': '23:59'}
        sleep = {}
        events = calendar[i].split(",")
        for id in events:
            event = exec_get_one(f"SELECT * FROM {EVENT_TABLE} WHERE {ID} = {int(id)};")
            start_time = event[4]
            end_time = event[5]
            for start in free_time:
                end = free_time[start]
                if (int(start_time.split(':')[0]) >= int(start.split(':')[0]) and int(start_time.split(':')[0]) <= int(end.split(':')[0])) or (int(end_time.split(':')[0]) <= int(end.split(':')[0]) and int(end_time.split(':')[0]) >= int(start.split(':')[0])):
                    if event[1] == 'Sleep':
                        sleep[start_time] = end_time
                    else:
                        free_time[start] = start_time
                        free_time[end_time] = end
                    break
            day.append(event)
        i += 1
        print(day)
        print(free_time)
        print(sleep)

        

def default_user_calendar(id):
    # Get all of the special events' id's
    defaults = exec_get_all(f"SELECT * FROM {EVENT_TABLE} WHERE id < 5;")
    components = f"({U_ID}, {SUNDAY}, {MONDAY}, {TUESDAY}, {WEDNESDAY}, {THURSDAY}, {FRIDAY}, {SATURDAY})"
    values = f"({id}, '1,2,3,4', '1,2,3,4', '1,2,3,4', '1,2,3,4', '1,2,3,4', '1,2,3,4', '1,2,3,4')"
    exec_commit(f"INSERT INTO {CALENDAR_TABLE}{components} VALUES {values};")