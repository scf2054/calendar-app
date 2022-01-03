import './Calendar.css';

import React, { Component } from 'react';
import { Table, Container } from 'reactstrap';

class Calendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            calendar_rows: []
        }
    }

    componentDidMount() {
        this.initializeCalendar(23, 7);
    }

    initializeCalendar=(sleep_start, sleep_end)=> {
        let rows = [];
        // Get the starting and ending time of the day
        let start_is_greater = sleep_start > sleep_end;
        // While the start is less than end, add a row to the calendar body
        for(let i = 0; i < 24; i++) {
            let not_during_sleep;
            if (start_is_greater) {
                not_during_sleep = (i >= sleep_end && i < sleep_start);
            } else {
                not_during_sleep = (i >= sleep_end || i < sleep_start);
            }
            if(not_during_sleep) {
                let time = this.getTime(i);
                rows.push(
                    <tr key={time}>
                        <th scope='row'>
                            {time}
                        </th>
                    </tr>
                );
            }
        }
        this.setState({calendar_rows: rows});
    }

    getTime=(hr)=> {
        let frame;
        if(hr >= 12) {
            frame = 'pm';
            if(hr > 12) {
                hr = hr % 12;
            }
        } else {
            frame = 'am'
            if(hr === 0) {
                hr = 12;
            }
        }
        return String(hr) + ':00' + frame;
    }

    calendarHeading=()=> {
        return this.props.current_user ? this.props.current_user[1] + "'s Schedgy" : "Schedgy"
    }

    render() {
        return (
            <Container>
                <h1 className='calendar-heading'>{this.calendarHeading()}</h1>
                <Table striped bordered className='calendar'>
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Sunday</th>
                            <th>Monday</th>
                            <th>Tuesday</th>
                            <th>Wednesday</th>
                            <th>Thursday</th>
                            <th>Friday</th>
                            <th>Saturday</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.calendar_rows}
                    </tbody>
                </Table>
            </Container>
            
        );
    }
}

export default Calendar