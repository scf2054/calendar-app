// import logo from './logo.svg';
import './App.css';

import React from 'react';
import Calendar from './Calendar';
import { Row } from 'reactstrap';

function App() {
  return (
    <div className="App">
      <Row className='calendar-row'>
        <Calendar/>
      </Row>
      <Row>

      </Row>
    </div>
  );
}

export default App;