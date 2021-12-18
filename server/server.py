from flask import Flask
from flask_restful import Resource, Api

from api.db.db_utils import *
from api.user_api import *
from api.event_api import *
from api.calendar_api import *

app = Flask(__name__) #create Flask instance

api = Api(app) #api router

# User
api.add_resource(Users, '/users')
api.add_resource(User, '/users/<int:id>')

# Event
api.add_resource(Events,'/events')

# Calendar
api.add_resource(Calendars, '/calendars')

if __name__ == '__main__':
    print("Loading db");
    exec_sql_file('schema.sql');
    print("Starting flask");
    app.run(debug=True), #starts Flask



    