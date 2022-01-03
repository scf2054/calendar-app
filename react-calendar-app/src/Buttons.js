import './Buttons.css';

import React, { Component } from 'react';
import { Col, Button } from 'reactstrap';

class Buttons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            view_edit_sleep: false,
        }
    }

    checkSignedIn=(event)=> {
        console.log(this.props.current_user);
        if(this.props.current_user) {
            const button_clicked = event.target.className.split(" ")[0];
            if(button_clicked === 'edit-sleep-button') {
                this.props.toggleEditSleep();
            } else if(button_clicked === 'create-event-button') {
                this.props.toggleCreateEvent()
            }   
        } else {
            alert("You must create an account or sign in to use this functionality.");
        }
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
            </>
        );
    }
}

export default Buttons