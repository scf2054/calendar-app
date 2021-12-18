from ..db.db_utils import *
from ..constants import *

def default_user_calendar(id):
    # Get all of the special events' id's
    defaults = exec_get_all(f"SELECT * FROM {EVENT_TABLE} WHERE id < 5;")
    components = f"({U_ID}, {SUNDAY}, {MONDAY}, {TUESDAY}, {WEDNESDAY}, {THURSDAY}, {FRIDAY}, {SATURDAY})"
    values = f"({id}, '1,2,3,4', '1,2,3,4', '1,2,3,4', '1,2,3,4', '1,2,3,4', '1,2,3,4', '1,2,3,4')"
    exec_commit(f"INSERT INTO {CALENDAR_TABLE}{components} VALUES {values};")