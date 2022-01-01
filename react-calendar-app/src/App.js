// import logo from './logo.svg';
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
      current_user: null
    }
  }

  setUser=(user)=> {
    this.setState({current_user: user});
  }

  toggleAccountPage=(event)=> {
    this.setState({view_account_page: !this.state.view_account_page});
  }

  toggleEditSleep=(event)=> {
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

  render() {
    return (
      <Container className="App">
        <Row className='calendar-row'>
          <Calendar/>
        </Row>
        <Row className='buttons-row'>
          <Buttons
            toggleAccountPage = {this.toggleAccountPage}
            toggleEditSleep = {this.toggleEditSleep}
            toggleCreateEvent = {this.toggleCreateEvent}
          />
        </Row>
        <AccountPage
          view_account_page = {this.state.view_account_page}
          toggleAccountPage = {this.toggleAccountPage}
          setUser = {this.setUser}
        />
        <EditSleepSchedule 
          view_edit_sleep = {this.state.view_edit_sleep}
          toggleEditSleep = {this.toggleEditSleep}
          getDayStr = {this.getDayStr}
        />
        <CreateNewEvent 
          view_create_event = {this.state.view_create_event}
          toggleCreateEvent = {this.toggleCreateEvent}
          getDayStr = {this.getDayStr}
        />
      </Container>
    );
  }
}

export default App;