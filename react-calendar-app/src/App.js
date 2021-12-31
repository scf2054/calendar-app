// import logo from './logo.svg';
import './App.css';

import React from 'react';
import Calendar from './Calendar';
import Buttons from './Buttons';
import { Row } from 'reactstrap';

function App() {
  return (
    <div className="App">
      <Row className='calendar-row'>
        <Calendar/>
      </Row>
      <Row>
        <Buttons/>
      </Row>
    </div>
  );
}

export default App;