import './Buttons.css';

import React, { Component } from 'react';
import { Col, Button, PopoverHeader, UncontrolledPopover, PopoverBody, Modal, ModalHeader, ModalBody, ModalFooter, InputGroup, InputGroupText, Input, Popover } from 'reactstrap';

class Buttons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            view_edit_sleep: false,
            view_edit_semester: false
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
            } else if(button_clicked === 'semester-button') {
                this.setState({view_edit_semester: true});
            }
        } else {
            alert("You must sign in to an account in order to use this functionality.");
        }
    }

    optimizeCalendar=()=> {
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

    saveSemester=()=> {
        if(this.props.saveSemesterDates() === 'success') {
            this.toggleEditSemester();
        }
    }

    toggleEditSemester=()=> {
        this.setState({view_edit_semester: !this.state.view_edit_semester});
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
                        className='semester-button'
                    >
                        Edit Semester Dates
                    </Button>
                    <Modal isOpen={this.state.view_edit_semester}>
                        <ModalHeader close={<Button onClick={this.toggleEditSemester} close/>}>
                            Edit Semester:
                        </ModalHeader>
                        <ModalBody>
                        <br />
                        <InputGroup id='semester-start'>
                            <InputGroupText>
                                When does your semester start?
                            </InputGroupText>
                            <Input className='semester-start' onClick={this.props.closeDateError} onChange={this.props.setSemesterStartStr} placeholder='dd-mm-yyyy' />
                        </InputGroup>
                        <br />
                        <InputGroup>
                            <InputGroupText>
                                When does your semester end?
                            </InputGroupText>
                            <Input className='semester-end' onClick={this.props.closeDateError} onChange={this.props.setSemesterEndStr} placeholder='dd-mm-yyyy' />
                        </InputGroup>
                        <br />
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={this.saveSemester} color='primary' className='save-semester' id='save-semester'>
                                Save
                            </Button>
                            <Popover target='save-semester' isOpen={this.props.view_date_error}>
                                <PopoverHeader>
                                    Error:
                                </PopoverHeader>
                                <PopoverBody>
                                    {this.props.date_error_message}
                                </PopoverBody>
                            </Popover>
                        </ModalFooter>
                    </Modal>
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