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
      current_user: null,
      events: {},
      semester_start: new Date().toISOString(),
      semester_end: new Date().toISOString()
    }
  }

  componentDidMount() {
    this.toggleAccountPage();
  }

  setUser=(user)=> {
    this.setState({current_user: user});
  }

  setSemesterStart=(date_dict)=> {
    this.setState({semester_start: date_dict}, () => {console.log("Start: " + this.state.semester_start)});
  }

  setSemesterEnd=(date_dict)=> {
    this.setState({semester_end: date_dict}, () => {console.log("End: " + this.state.semester_end)});
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
            events = {this.props.events}
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
          toggleAccountPage = {this.toggleAccountPage}
          setUser = {this.setUser}
          setSemesterStart = {this.setSemesterStart}
          setSemesterEnd = {this.setSemesterEnd}
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