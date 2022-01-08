import './Calendar.css';

import React, { Component } from 'react';
import { Container } from 'reactstrap';
import Kalend, { CalendarView } from 'kalend';
import 'kalend/dist/styles/index.css';

// Play around with Calendar components in bookmark

class Calendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            placeholder: false
        }
    }

    // Create a function that puts all the user's events on the calendar

    calendarHeading=()=> {
        return this.props.current_user ? this.props.current_user[1] + "'s Schedgy" : "Schedgy"
      }

    render() {
        return (
            <Container>
                <h1 className='calendar-heading'>{this.calendarHeading()}</h1>
                <Kalend className='calendar'
                    events = {this.props.events}
                    hourHeight={100}
                    disabledViews={[CalendarView.AGENDA]}
                    weekDayStart={'Sunday'}
                    language={'en'}
                />
            </Container>
            
        );
    }
}

export default Calendar