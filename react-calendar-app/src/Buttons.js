import './Buttons.css';

import React, { Component } from 'react';
import { Col, Button, PopoverHeader, UncontrolledPopover, PopoverBody } from 'reactstrap';

class Buttons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            view_edit_sleep: false,
        }
    }

    checkSignedIn=(event)=> {
        if(this.props.current_user) {
            const button_clicked = event.target.className.split(" ")[0];
            if(button_clicked === 'edit-sleep-button') {
                this.props.toggleEditSleep();
            } else if(button_clicked === 'create-event-button') {
                this.props.toggleCreateEvent()
            } else if(button_clicked === 'optimize-calendar-button') {
                this.optimizeCalendar();
            }
        } else {
            alert("You must sign in to an account in order to use this functionality.");
        }
    }

    optimizeCalendar=()=> {
        console.log(this.props.current_user[0]);
        fetch('/users/' + this.props.current_user[0], {
            method: 'POST',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(json => {
            // re-render the calendar
            console.log(json);
        })
    }
    
    render() {
        return (
            <>
                <Col>
                    <Button
                        color='info'
                        outline
                        onClick={this.props.toggleAccountPage}
                        className='account-button'
                    >
                        Sign-In/Create Account
                    </Button>
                </Col>
                <Col>
                    <Button
                        color='info'
                        outline
                        onClick={this.checkSignedIn}
                        className='edit-sleep-button'
                    >
                        Edit Sleep Schedule
                    </Button>
                </Col>
                <Col>
                    <Button
                        color='info'
                        outline
                        onClick={this.checkSignedIn}
                        className='create-event-button'
                    >
                        Create Event
                    </Button>
                </Col>
                <Col>
                    <Button
                        color='danger'
                        onClick={this.checkSignedIn}
                        className='optimize-calendar-button'
                        id='optimize-calendar-button'
                    >
                        Optimize Calendar
                    </Button>
                    <UncontrolledPopover
                        target='optimize-calendar-button'
                        trigger='focus'
                        placement='top'
                    >
                        <PopoverHeader>
                            Success!
                        </PopoverHeader>
                        <PopoverBody>
                            The calendar for {this.props.current_user ? this.props.current_user[1] : null} has been optimized!
                        </PopoverBody>
                    </UncontrolledPopover>
                </Col>
            </>
        );
    }
}

export default Buttons