from flask import Flask
from flask_restful import Resource, Api


from api.db.db_utils import *
from api.example_api import *

app = Flask(__name__) #create Flask instance

api = Api(app) #api router

api.add_resource(Users, '/users')
api.add_resource(Events,'/events')
api.add_resource(Calendars, '/calendars')

if __name__ == '__main__':
    print("Loading db");
    exec_sql_file('schema.sql');
    print("Starting flask");
    app.run(debug=True), #starts Flask



    