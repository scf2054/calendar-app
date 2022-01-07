import './App.css';

import React, { Component } from 'react';
import Calendar from './Calendar';
import Buttons from './Buttons';
import CreateNewEvent from './CreateNewEvent';
import EditSleepSchedule from './EditSleepSchedule';
import AccountPage from './AccountPage';
import { Container, Row } from 'reactstrap';

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
      events: {},
      semester_start_dict: {
        'day': 0,
        'month': 0,
        'year': 0
      },
      semester_end_dict: {
        'day': 0,
        'month': 0,
        'year': 0
      },
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

  setSemesterStartDict=(date_dict)=> {
    this.setState({semester_start_dict: date_dict});
  }

  setSemesterEndDict=(date_dict)=> {
    this.setState({semester_end_dict: date_dict});
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
      const start_d = start_split[0];
      const start_m = start_split[1];
      const start_y = start_split[2];
      const end_d = end_split[0];
      const end_m = end_split[1];
      const end_y = end_split[2];
      console.log(start_y);
      console.log(start_y.length);
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
      this.setSemesterStartDict({
        'day': start_d_num, 
        'month': start_m_num, 
        'year': start_y_num
      });
      this.setSemesterEndDict({
        'day': end_d_num, 
        'month': end_m_num, 
        'year': end_y_num
      });        
      this.toggleAccountPage();
      this.toggleCreateUserSuccess();
    } catch(e) {
      if(e instanceof TypeError) {
        this.setState({date_error_message: e.message})
      } else {
        this.setState({date_error_message: "Internal Error"});
      }
      this.setState({view_date_error: true});
      console.log(e);
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

  render() {
    return (
      <Container className="App">
        <Row className='calendar-row'>
          <Calendar
            current_user = {this.state.current_user}
            events = {this.state.events}
          />
        </Row>
        <Row className='buttons-row'>
          <Buttons
            current_user = {this.state.current_user}
            toggleAccountPage = {this.toggleAccountPage}
            toggleEditSleep = {this.toggleEditSleep}
            toggleCreateEvent = {this.toggleCreateEvent}
          />
        </Row>
        <AccountPage
          view_account_page = {this.state.view_account_page}
          view_date_error = {this.state.view_date_error}
          date_error_message = {this.state.date_error_message}
          toggleAccountPage = {this.toggleAccountPage}
          setUser = {this.setUser}
          setSemesterStartStr = {this.setSemesterStartStr}
          setSemesterEndStr = {this.setSemesterEndStr}
          saveSemesterDates = {this.saveSemesterDates}
          closeDateError = {this.closeDateError}
        />
        <EditSleepSchedule 
          current_user = {this.state.current_user}
          view_edit_sleep = {this.state.view_edit_sleep}
          toggleEditSleep = {this.toggleEditSleep}
          getDayStr = {this.getDayStr}
          convertTime = {this.convertTime}
        />
        <CreateNewEvent 
          current_user = {this.state.current_user}
          view_create_event = {this.state.view_create_event}
          toggleCreateEvent = {this.toggleCreateEvent}
          getDayStr = {this.getDayStr}
          convertTime = {this.convertTime}
        />
      </Container>
    );
  }
}

export default App;