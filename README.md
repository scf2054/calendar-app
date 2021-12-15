# Schedgy
Schedgy is an application that plans out every day of the week for you given any kind of school or work 
schedule.


## Prerequisites
- Python >= 3.7
- npm v8.1.2
- node >= 16.13.1

## How to Run it
1. Clone the repository and go to the root directory.
2. In one terminal window, execute `python server/server.py` (for Mac users, `python3 server/server.py`)
3. In a second terminal window, execute `cd react-calendar-app`
4. In the same window, execute `npm start`


## Features

### School Calendar
If a user is creating a calendar for school or university, they are required to put in their classes, 
amount of credits/priority, and the time frame in which the class takes place. Given this information, 
the application will come up with a homework schedule for the user based on the class's amount of credits 
or the priority it has on the user.

### Work Calendar
When creating a work calendar, this operates just the same as a school calendar, however, the application 
doesn't create time frames dedicated to homework.

### Hybrid Calendar
Combining both work and school calendars is for those who have a lot of priorities to keep track of in their 
life, but "Schedgy" can take care of that. Given both work and class events, the application creates the 
most optimized calendar to fit the needs of the user and their massive time-commitment life.

### Special Events
For any kind of calendar (school, work, or hybrid), a sleep event is automatically assigned to every single 
day of the week. This is defaulted to eight hours a night, 11:00-7:00, but the user can change this whenever 
they'd like. The amount of hours and when they'd like to go to sleep every night is adapted to their calendar 
as a whole. The same goes for the three meals a day; breakfast, lunch, and dinner. All three of these are added 
to the calendar based on all other priorities that are already on the calendar.

### Custom Events
A user is able to create just about any kind of event for themselves. This can span from a project to a wedding, 
as long as the time frame is given, "Schedgy" adapts the user's calendar to this new event. There is also the 
functionality to edit an event that was given to the user. If a homework event isn't up to standards for a student, 
they can make it shorter or longer and the calendar will adapt.