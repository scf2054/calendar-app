import './App.css';

import React, { Component } from 'react';
import Buttons from './Buttons';
import CreateNewEvent from './CreateNewEvent';
import EditSleepSchedule from './EditSleepSchedule';
import AccountPage from './AccountPage';
import { Container, Row } from 'reactstrap';
import Kalend, { CalendarView } from 'kalend';
import 'kalend/dist/styles/index.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view_account_page: false,
      view_edit_sleep: false,
      view_create_event: false,
      view_date_error: false,
      date_error_message: "Make sure the dates you input are in correct formatting: 'dd-mm-yyyy'",
      current_user: null,
      events: {'08-01-2022': [
        {
        id: 1,
        startAt: '2021-01-08T18:00:00.000Z',
        endAt: '2021-01-08T19:00:00.000Z',
        summary: 'test',
        color: 'blue',
        calendarID: 'work'
        }
      ]},
      semester_start_str: '00-00-0000',
      semester_end_str: '00-00-0000'
    }
  }

  componentDidMount() {
    this.toggleAccountPage();
  }

  setUser=(user)=> {
    this.setState({current_user: user});
  }

  setSemesterStartStr=(event)=> {
    this.setState({semester_start_str: event.target.value});
  }

  setSemesterEndStr=(event)=> {
    this.setState({semester_end_str: event.target.value});
  }

  toggleAccountPage=()=> {
    this.setState({view_account_page: !this.state.view_account_page});
  }

  toggleEditSleep=()=> {
    this.setState({view_edit_sleep: !this.state.view_edit_sleep});
  }

  toggleCreateEvent=()=> {
    this.setState({view_create_event: !this.state.view_create_event});
  }
  
  closeDateError=()=> {
    this.setState({view_date_error: false});
  }

  saveSemesterDates=()=> {
    try {
      const start_split = this.state.semester_start_str.split("-");
      const end_split = this.state.semester_end_str.split("-");
      const start_d = start_split[1];
      const start_m = start_split[0];
      const start_y = start_split[2];
      const end_d = end_split[1];
      const end_m = end_split[0];
      const end_y = end_split[2];
      if(start_d.length !== 2 || end_d.length !== 2 || start_m.length !== 2 || end_m.length !== 2 || start_y.length !== 4 || end_y.length !== 4) {
        throw TypeError("Time inputted does not fit format 'dd-mm-yyyy'.");
      }
      const start_d_num = parseInt(start_d);
      const start_m_num = parseInt(start_m);
      const start_y_num = parseInt(start_y);
      const end_d_num = parseInt(end_d);
      const end_m_num = parseInt(end_m);
      const end_y_num = parseInt(end_y);
      const months_31 = [1, 3, 5, 7, 8, 10, 12];
      const months_30 = [4, 6, 9, 11];
      const start_is_leap_year = start_y_num % 4 === 0;
      const end_is_leap_year = end_y_num % 4 === 0;
      if(start_m_num === 2 && ((start_is_leap_year && start_d_num > 29) || (!start_is_leap_year && start_d_num > 28))) {
        throw TypeError("Start date is out of range.");
      } else if(
          start_y_num < 1900 || start_y_num > 2100 ||
          (months_31.includes(start_m_num) && start_d_num > 31) ||
          (months_30.includes(start_m_num) && start_d_num > 30) ||
          start_d_num < 1
      ) {
        throw TypeError("Start date is out of range.");
      }
      if(end_m_num === 2 && ((end_is_leap_year && end_d_num > 29) || (!end_is_leap_year && end_d_num > 28))) {
        throw TypeError("End date is out of range.");
      } else if(
        end_y_num < 1900 || end_y_num > 2100 ||
        (months_31.includes(end_m_num) && end_d_num > 31) ||
        (months_30.includes(end_m_num) && end_d_num > 30) ||
        end_d_num < 1
      ) {
        throw TypeError("End date is out of range.");
      } 
      if(new Date(this.state.semester_start_str) > new Date(this.state.semester_end_str)) {
        throw TypeError("The end date must come after the start date.")
      }    
      this.renderEvents(this.state.current_user[0]);
      this.setState({view_account_page: false});
      return 'success';
    } catch(e) {
      if(e instanceof TypeError) {
        this.setState({date_error_message: e.message})
      } else {
        this.setState({date_error_message: "Internal Error"});
      }
      this.setState({view_date_error: true});
      console.log(e);
      return e;
    }
  }

  getDayStr=(days_dict)=> {
    let days = [];
    for(let key in days_dict) {
      if(days_dict[key]) {
        let id = parseInt(key);
        switch(id) {
          case 1:
            days.push('Sunday');
            break;
          case 2:
            days.push('Monday');
            break;
          case 3:
            days.push('Tuesday');
            break;
          case 4:
            days.push('Wednesday');
            break;
          case 5:
            days.push('Thursday');
            break;
          case 6:
            days.push('Friday');
            break;
          case 7:
            days.push('Saturday');
            break;
          default:
            continue;
        }
      }
    }
    let day_str = "";
    const days_len = days.length;
    for(let i = 0; i < days_len; i++) {
      day_str += days[i];
      if(i === days_len-2) {
        day_str += ' and ';
      } else if(days_len > 1 && i !== days_len-1) {
        day_str += ', ';
      }
    }
    return day_str;
  }

  convertTime=(time, frame)=> {
    if(frame === null) {
      throw TypeError("You must select 'am' or 'pm' for your times.");
    }
    const split = time.split(':');
    if(split.length === 1) {
        throw SyntaxError("Time must be in format: hh:mm.");
    }
    let hr = parseInt(split[0]);
    let min = parseInt(split[1]);
    if(!min) {
        min = 0;
    }
    let hrs_greater = Math.floor(min / 60);
    hr += hrs_greater;
    min -= (60 * hrs_greater);
    if(frame === 'pm' && hr !== 12) {
        hr += 12
    } else if(frame === 'am' && hr === 12) {
        hr = 0;
    }
    if(min < 10) {
        min = '0' + min;
    }
    return hr + ':' + min;
  }

  renderEvents=(u_id, semester_start=this.state.semester_start_str, semester_end=this.state.semester_end_str)=> {
    const start_date = new Date(semester_start);
    let starting_days = this.getStartingDays(start_date, start_date.getDay() + 1);
    const end_date = new Date(semester_end);
    let ending_days = this.getEndingDays(end_date, end_date.getDay() + 1);
    console.log(semester_start);
    console.log(start_date);
    console.log(semester_end);
    console.log(end_date);
    let new_events = {}
    let current_event;
    let current_date;
    let current_date_str;
    let end_semester_date;
    let event_dicts;
    let day_id;
    let start_str;
    let end_str;
    let current_week;
    starting_days.sort(function(a, b){return a.getDay() - b.getDay()})
    ending_days.sort(function(a, b){return a.getDay() - b.getDay()})
    fetch('/events/user/' + u_id)
    .then(response => response.json())
    .then(json => {
      for(let i = 0; i < json.length; i++) {
        current_event = json[i];
        day_id = current_event[7];
        start_str = this.dateToString(starting_days[day_id-1], true);
        end_str = this.dateToString(ending_days[day_id-1], true);
        current_week = start_str;
        current_date = new Date(current_week);
        current_date.setDate(current_date.getDate() + 1);
        end_semester_date = new Date(end_str);
        end_semester_date.setDate(end_semester_date.getDate() + 1);
        while(current_date <= end_semester_date) {
          current_date_str = this.dateToString(current_date);
          event_dicts = this.createEventDict(current_event, current_date);
          for(let j = 0; j < event_dicts.length; j++) {
            !new_events[current_date_str] ? new_events[current_date_str] = [event_dicts[j]] : new_events[current_date_str].push(event_dicts[j]);
          }
          current_date.setDate(current_date.getDate() + 7);
        }
      }
      this.setState({events: new_events}, () => console.log(this.state.events));
    })
  }

  getStartingDays=(start_date, day_id)=> {
    let starts = [new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date()];
    let day;
    const start_year = start_date.getFullYear();
    const start_month = start_date.getMonth();
    for(let i = 1; i < 8; i++) {
      day = starts[i-1];
      day.setFullYear(start_year, start_month);
      if(i < day_id) {
        day.setDate(start_date.getDate() + 7 - (day_id-i));
      } else if(i > day_id) {
        day.setDate(start_date.getDate() + (i-day_id));
      } else {
        day.setDate(start_date.getDate());
      }
    }
    return starts;
  }

  getEndingDays=(end_date, day_id)=> {
    let ends = [new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date()];
    let day;
    const end_year = end_date.getFullYear();
    const end_month = end_date.getMonth();
    for(let i = 1; i < 8; i++) {  
      day = ends[i-1];
      day.setFullYear(end_year, end_month);
      if(i < day_id) {
        day.setDate(end_date.getDate() - (day_id-i));
      } else if(i > day_id) {
        day.setDate(end_date.getDate() - 7 + (i-day_id));
      } else {
        day.setDate(end_date.getDate());
      }
    }
    return ends;
  }

  dateToString=(date, yr_start=false)=> {
    let day_id = date.getDate();
    let month_id = date.getMonth() + 1;
    if(day_id < 10) {
      day_id = "0" + day_id;
    }
    if(month_id < 10) {
      month_id = "0" + month_id;
    }
    return yr_start ? date.getFullYear() + "-" + month_id + "-" + day_id: day_id + "-" + month_id + "-" + date.getFullYear();
  }

  createEventDict=(event, date)=> {
    let event_color;
    const event_priority = event[3];
    if(event_priority === 3) {
      event_color = 'red'
    } else if(event_priority === 2) {
      event_color = 'green'
    } else {
      event_color = 'blue'
    }
    if(this.timeToMin(event[4]) > this.timeToMin(event[5]) && event[1] === 'Sleep') {
      let bedtime_date = new Date();
      const bedtime_split = event[4].split(":");
      bedtime_date.setHours(parseInt(bedtime_split[0]));
      bedtime_date.setMinutes(parseInt(bedtime_split[1]));
      bedtime_date.setFullYear(date.getFullYear(), date.getMonth(), date.getDate())
      let eleven_fifty_nine = new Date();
      eleven_fifty_nine.setHours(23);
      eleven_fifty_nine.setMinutes(59);
      eleven_fifty_nine.setFullYear(date.getFullYear(), date.getMonth(), date.getDate())

      let midnight = new Date();
      midnight.setHours(0);
      midnight.setHours(0); 
      midnight.setFullYear(date.getFullYear(), date.getMonth(), date.getDate())
      let wake_up_date = new Date();
      const wake_up_split = event[5].split(":");
      wake_up_date.setHours(parseInt(wake_up_split[0]));
      wake_up_date.setMinutes(parseInt(wake_up_split[1]));
      wake_up_date.setFullYear(date.getFullYear(), date.getMonth(), date.getDate())

      return [
        {
          id: event[0] + "a",
          startAt: bedtime_date.toISOString(),
          endAt: eleven_fifty_nine.toISOString(),
          summary: event[1],
          color: event_color,
          calendarID: event[2] + "a"
        },
        {
          id: event[0] + "b",
          startAt: midnight.toISOString(),
          endAt: wake_up_date.toISOString(),
          summary: event[1],
          color: event_color,
          calendarID: event[2] + "b"
        }
      ]
    }
    let start_date = new Date();
    const start_split = event[4].split(":");
    start_date.setHours(parseInt(start_split[0]));
    start_date.setMinutes(parseInt(start_split[1]));
    start_date.setFullYear(date.getFullYear(), date.getMonth(), date.getDate())
    let end_date = new Date();
    const end_split = event[5].split(":");
    end_date.setHours(parseInt(end_split[0]));
    end_date.setMinutes(parseInt(end_split[1]));
    end_date.setFullYear(date.getFullYear(), date.getMonth(), date.getDate())

    return [
        {
        id: event[0],
        startAt: start_date.toISOString(),
        endAt: end_date.toISOString(),
        summary: event[1],
        color: event_color,
        calendarID: event[2]
      }
    ]
  }

  timeToMin=(time)=> {
    const time_split = time.split(":");
    return (parseInt(time_split[0]) * 60) + parseInt(time_split[1]);
  }

  calendarHeading=()=> {
    return this.state.current_user ? this.state.current_user[1] + "'s Schedgy" : "Schedgy"
  }

  render() {
    return (
      <Container className="App">
        <h1 className='calendar-heading'>{this.calendarHeading()}</h1>
        <Row className='buttons-row'>
          <Buttons
            current_user = {this.state.current_user}
            view_date_error = {this.state.view_date_error}
            date_error_message = {this.state.date_error_message}
            toggleAccountPage = {this.toggleAccountPage}
            toggleEditSleep = {this.toggleEditSleep}
            toggleCreateEvent = {this.toggleCreateEvent}
            setSemesterStartStr = {this.setSemesterStartStr}
            setSemesterEndStr = {this.setSemesterEndStr}
            saveSemesterDates = {this.saveSemesterDates}
            closeDateError = {this.closeDateError}
            renderEvents = {this.renderEvents}
          />
        </Row>
        <AccountPage
          view_account_page = {this.state.view_account_page}
          view_date_error = {this.state.view_date_error}
          date_error_message = {this.state.date_error_message}
          semester_start_str = {this.state.semester_start_str}
          semester_end_str = {this.state.semester_end_str}
          toggleAccountPage = {this.toggleAccountPage}
          setUser = {this.setUser}
          setSemesterStartStr = {this.setSemesterStartStr}
          setSemesterEndStr = {this.setSemesterEndStr}
          saveSemesterDates = {this.saveSemesterDates}
          closeDateError = {this.closeDateError}
          renderEvents = {this.renderEvents}
        />
        <EditSleepSchedule 
          current_user = {this.state.current_user}
          view_edit_sleep = {this.state.view_edit_sleep}
          toggleEditSleep = {this.toggleEditSleep}
          getDayStr = {this.getDayStr}
          convertTime = {this.convertTime}
          renderEvents = {this.renderEvents}
        />
        <CreateNewEvent 
          current_user = {this.state.current_user}
          view_create_event = {this.state.view_create_event}
          toggleCreateEvent = {this.toggleCreateEvent}
          getDayStr = {this.getDayStr}
          convertTime = {this.convertTime}
          renderEvents = {this.renderEvents}
        />
        <Row className='calendar-row'>
          <Kalend
            events={this.state.events}
            initialDate={new Date().toISOString()}
            hourHeight={100}
            initialView={CalendarView.WEEK}
            disabledViews={[CalendarView.AGENDA]}
            timeFormat={'24'}
            weekDayStart={'Sunday'}
            language={'en'}
          />
        </Row>
      </Container>
    );
  }
}

export default App;