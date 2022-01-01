// import logo from './logo.svg';
import './App.css';

import React, { Component } from 'react';
import Calendar from './Calendar';
import Buttons from './Buttons';
import CreateNewEvent from './CreateNewEvent';
import EditSleepSchedule from './EditSleepSchedule';
import { Container, Row } from 'reactstrap';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view_edit_sleep: false,
      view_create_event: false
    }
  }

  toggleEditSleep=(event)=> {
    this.setState({view_edit_sleep: !this.state.view_edit_sleep});
  }

  toggleCreateEvent=()=> {
    this.setState({view_create_event: !this.state.view_create_event});
  }

  render() {
    return (
      <Container className="App">
        <Row className='calendar-row'>
          <Calendar/>
        </Row>
        <Row className='buttons-row'>
          <Buttons
            toggleCreateEvent = {this.toggleCreateEvent}
            toggleEditSleep = {this.toggleEditSleep}
          />
        </Row>
        <CreateNewEvent 
          view_create_event = {this.state.view_create_event}
          toggleCreateEvent = {this.toggleCreateEvent}
        />
        <EditSleepSchedule 
          view_edit_sleep = {this.state.view_edit_sleep}
          toggleEditSleep = {this.toggleEditSleep}
        />
      </Container>
    );
  }
}

export default App;