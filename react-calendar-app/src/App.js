// import logo from './logo.svg';
import './App.css';

import React, { Component } from 'react';
import Calendar from './Calendar';
import Buttons from './Buttons';
import CreateNewEvent from './CreateNewEvent';
import { Container, Row } from 'reactstrap';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view_create_event: false
    }
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
          />
        </Row>
        <CreateNewEvent 
          view_create_event = {this.state.view_create_event}
          toggleCreateEvent = {this.toggleCreateEvent}
        />
      </Container>
    );
  }
}

export default App;