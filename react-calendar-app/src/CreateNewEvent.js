import React, { Component } from 'react';
import { Col, Button, Modal, ModalHeader, ModalBody, InputGroup, InputGroupText, Input, Dropdown, DropdownToggle, DropdownItem, DropdownMenu, Popover, PopoverHeader, PopoverBody, Row, ButtonGroup, ListGroup, ListGroupItem, ModalFooter } from 'reactstrap';

class CreateNewEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            view_event_type_dropdown: false,
            view_work_popover: false,
            view_school_popover: false,
            view_special_popover: false,
            view_other_popover: false,
            view_low_popover: false,
            view_medium_popover: false,
            view_high_popover: false,
            view_save_error_message: false,

            days_selected: {
                '1': true,
                '2': false,
                '3': false,
                '4': false,
                '5': false,
                '6': false,
                '7': false
            },

            event_type_selected: null,
            event_priority_selected: 1,
            event_start_frame_selected: null,
            event_end_frame_selected: null,
            event_name_input: null,
            event_start_input: null,
            event_end_input: null,
            event_location_input: null,

            save_error_message: null
        }
    }

    saveEvent=()=> {
        try {
            const start_time = this.props.convertTime(this.state.event_start_input, this.state.event_start_frame_selected);
            let end_time = null;
            if(this.state.event_end_input) {
                end_time = this.props.convertTime(this.state.event_end_input, this.state.event_end_frame_selected);
            }
            let no_days_selected = true;
            for(let day_id in this.state.days_selected) {
                if(this.state.days_selected[day_id]) {
                    no_days_selected = false;
                    this.postEvent(start_time, end_time, day_id);
                }
            }
            if(no_days_selected) {
                throw SyntaxError("No days have been selected.");
            }
            this.initializeData();
            this.setState({view_event_created_modal: true});
        } catch(e) {
            this.setState({save_error_message: e.message});
            this.setState({view_save_error_message: true});
            console.log(e);
        }
    }

    postEvent=(start_time, end_time, day_id)=> {
        fetch('/events/user/' + this.props.current_user[0], {
            method: 'POST',
            body: JSON.stringify({
                'event_name': this.state.event_name_input,
                'event_type': this.state.event_type_selected,
                'event_priority': this.state.event_priority_selected,
                'start_time': start_time,
                'end_time': end_time,
                'day_id': parseInt(day_id),
                'event_location': this.state.event_location_input
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => {
            if(response.status >= 200 && response.status < 300) {
                return response.json();
            } else if(response.status === 406) {
                alert("This new event overlaps with a high priority event, failed to update.")
            }
        })
    }

    initializeData=()=> {
        this.setState({days_selected: {
            '1': true,
            '2': false,
            '3': false,
            '4': false,
            '5': false,
            '6': false,
            '7': false
        }});
        this.setState({event_type_selected: null});
        this.setState({event_priority_selected: 1});
        this.setState({event_start_frame_selected: null});
        this.setState({event_end_frame_selected: null});
        this.setState({event_name_input: null});
        this.setState({event_start_input: null});
        this.setState({event_end_input: null});
        this.setState({event_location_input: null});
        this.setState({save_error_message: null});
    }

    toggleEventTypeDropdown=(event)=> {
        this.setState({view_event_type_dropdown: !this.state.view_event_type_dropdown});
    }

    toggleTypePopover=(type)=> {
        type = type.toLowerCase();
        if(type === 'work') {
            this.setState({view_work_popover: !this.state.view_work_popover});
        } else if(type === 'school') {
            this.setState({view_school_popover: !this.state.view_school_popover});
        } else if(type === 'special') {
            this.setState({view_special_popover: !this.state.view_special_popover});
        } else if(type === 'other') {
            this.setState({view_other_popover: !this.state.view_other_popover});
        }
    }

    togglePriorityPopover=(event)=> {
        let priority = parseInt(event.target.value);
        if(priority === 1) {
            this.setState({view_low_popover: !this.state.view_low_popover});
        } else if(priority === 2) {
            this.setState({view_medium_popover: !this.state.view_medium_popover});
        } else if(priority === 3) {
            this.setState({view_high_popover: !this.state.view_high_popover});
        }
    }

    closeBothModals=()=> {
        this.setState({view_event_created_modal: false});
        this.props.toggleCreateEvent();
        this.props.renderEvents(this.props.current_user[0]);
    }

    getTypeFromDropdown=(event)=> {
        this.toggleTypePopover(event.target.value);
    }

    selectEventType=(event)=> {
        let type = event.target.value;
        this.setState({event_type_selected: type});
        this.toggleTypePopover(type);
    }

    selectEventPriority=(event)=> {
        this.setState({event_priority_selected: parseInt(event.target.value)});
    }

    selectEventFrame=(event)=> {
        let time = event.target.className.split(" ")[0];
        let frame = event.target.value;
        if(time === 'start') {
            this.setState({event_start_frame_selected: frame});
        } else if(time === 'end') {
            this.setState({event_end_frame_selected: frame});
        }
    }

    selectDayOfWeek=(event)=> {
        const key = event.target.value;
        const value = !this.state.days_selected[key];
        const new_selected = Object.assign(this.state.days_selected, {[key]: value});
        this.setState({days_selected: new_selected});
    }

    getBsStyle=(key)=> {
        return this.state.days_selected[key] ? 'primary': 'default';
    }

    setEventName=(event)=> {
        this.setState({event_name_input: event.target.value})
    }

    setTimes=(event)=> {
        let start_end = event.target.className.split(" ")[0];
        let time = event.target.value;
        if(start_end === 'start') {
            this.setState({event_start_input: time});
        } else if(start_end === 'end') {
            this.setState({event_end_input: time});
        }
    }

    setEventLocation=(event)=> {
        this.setState({event_location_input: event.target.value});
    }

    getPriorityStr=(level)=> {
        switch(level) {
            case 1:
                return 'Low';
            case 2:
                return 'Medium';
            case 3:
                return 'High';
            default:
                return null;
        }
    }

    render() {
        return (
            <Modal className='create-event-modal' isOpen={this.props.view_create_event}>
            <ModalHeader close={<Button onClick={this.props.toggleCreateEvent} close/>}>
                Create New Event for {this.props.current_user ? this.props.current_user[1] : null}:
            </ModalHeader>
            <ModalBody onClick={() => this.setState({view_save_error_message: false})}>
                <InputGroup>
                    <InputGroupText>
                        Event Name:
                    </InputGroupText>
                    <Input onChange={this.setEventName} />
                </InputGroup>
                <br/>
                <Row>
                    <Col>
                        <Dropdown className='event-type-dropdown' onClick={this.toggleEventTypeDropdown} isOpen={this.state.view_event_type_dropdown}>
                            <DropdownToggle caret>
                                Event Type
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem header>
                                    All Different Event Types
                                </DropdownItem>
                                <DropdownItem value='School' id='school-item' onMouseEnter={this.getTypeFromDropdown} onMouseLeave={this.getTypeFromDropdown} onClick={this.selectEventType}>
                                    School
                                </DropdownItem>
                                <Popover target='school-item' isOpen={this.state.view_school_popover} placement='left' text='Left'>
                                    <PopoverHeader>
                                        School Event Type
                                    </PopoverHeader>
                                    <PopoverBody>
                                        Events like this can include classes, homework, office hours, and group project meetings. If the event priority is set to "high", then a homework event with "low" priority is automatically created for this class and added to the calendar. An event with this type will default to "low" priority.
                                    </PopoverBody>
                                </Popover>
                                <DropdownItem value='Work' id='work-item' onMouseEnter={this.getTypeFromDropdown} onMouseLeave={this.getTypeFromDropdown} onClick={this.selectEventType}>
                                    Work
                                </DropdownItem>
                                <Popover target='work-item' isOpen={this.state.view_work_popover} placement='left' text='Left'>
                                    <PopoverHeader>
                                        Work Event Type
                                    </PopoverHeader>
                                    <PopoverBody>
                                        An event with this type will default to "high" priority. Events like this can include work shifts, meetings, and lunch breaks.
                                    </PopoverBody>
                                </Popover>
                                <DropdownItem value='Special' id='special-item' onMouseEnter={this.getTypeFromDropdown} onMouseLeave={this.getTypeFromDropdown} onClick={this.selectEventType}>
                                    Special
                                </DropdownItem>
                                <Popover target='special-item' isOpen={this.state.view_special_popover} placement='left' text='Left'>
                                    <PopoverHeader>
                                        Special Event Type
                                    </PopoverHeader>
                                    <PopoverBody>
                                        Events like this can include breakfast, lunch, and dinner. An event with this type will default to "medium" priority.
                                    </PopoverBody>
                                </Popover>
                                <DropdownItem value='Other' id='other-item' onMouseEnter={this.getTypeFromDropdown} onMouseLeave={this.getTypeFromDropdown} onClick={this.selectEventType}>
                                    Other
                                </DropdownItem>
                                <Popover target='other-item' isOpen={this.state.view_other_popover} placement='left' text='Left'>
                                    <PopoverHeader>
                                        Other Event Type
                                    </PopoverHeader>
                                    <PopoverBody>
                                        Events like this can include homework events, doctor's appointement, wedding, or funeral. An event with this type will default to "low" priority.
                                    </PopoverBody>
                                </Popover>
                            </DropdownMenu>
                        </Dropdown>
                    </Col>
                    <Col>
                        <label htmlFor='event-priority'>Event Priority:</label>
                        <ButtonGroup id='event-priority'>
                            <Button value={1} id='low-button' onMouseEnter={this.togglePriorityPopover} onMouseLeave={this.togglePriorityPopover} onClick={this.selectEventPriority}>
                                Low
                            </Button>
                            <Popover target='low-button' isOpen={this.state.view_low_popover} placement='bottom' text='Bottom'>
                                <PopoverHeader>
                                    Low Priority
                                </PopoverHeader>
                                <PopoverBody>
                                    An event with "low" priority can have its time changed freely on the calendar during optimization.
                                </PopoverBody>
                            </Popover>
                            <Button value={2} id='medium-button' onMouseEnter={this.togglePriorityPopover} onMouseLeave={this.togglePriorityPopover} onClick={this.selectEventPriority}>
                                Medium
                            </Button>
                            <Popover target='medium-button' isOpen={this.state.view_medium_popover} placement='bottom' text='Bottom'>
                                <PopoverHeader>
                                    Medium Priority
                                </PopoverHeader>
                                <PopoverBody>
                                    An event with "medium" priority can have its time changed but as a last resort in order to fit all "high" priority events.
                                </PopoverBody>
                            </Popover>
                            <Button value={3} id='high-button' onMouseEnter={this.togglePriorityPopover} onMouseLeave={this.togglePriorityPopover} onClick={this.selectEventPriority}>
                                High
                            </Button>
                            <Popover target='high-button' isOpen={this.state.view_high_popover} placement='bottom' text='Bottom'>
                                <PopoverHeader>
                                    High Priority
                                </PopoverHeader>
                                <PopoverBody>
                                    An event with "high" priority cannot have its time changed after creation or during optimization.
                                </PopoverBody>
                            </Popover>
                        </ButtonGroup>
                    </Col>
                </Row>
                <br/>
                <label htmlFor='start-end-input'>(start time is required)</label>
                <Row className='start-end-input' id='start-end-input'>
                    <Col>
                        <InputGroup id='start-input'>
                            <InputGroupText>
                                Start Time:
                            </InputGroupText>
                            <Input className='start' placeholder='00:00' onChange={this.setTimes} />
                        </InputGroup>
                        <ButtonGroup>
                            <Button className='start' value='am' onClick={this.selectEventFrame}>AM</Button>
                            <Button className='start' value='pm' onClick={this.selectEventFrame}>PM</Button>
                        </ButtonGroup>
                    </Col>
                    <Col>
                        <InputGroup>
                            <InputGroupText>
                                End Time:
                            </InputGroupText>
                            <Input className='end' placeholder='00:00' onChange={this.setTimes} />
                        </InputGroup>
                        <ButtonGroup>
                            <Button className='end' value='am' onClick={this.selectEventFrame}>AM</Button>
                            <Button className='end' value='pm' onClick={this.selectEventFrame}>PM</Button>
                        </ButtonGroup>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <label htmlFor='day-of-week'>Day of the Week (required):</label>
                    <ButtonGroup className='days-of-week' id='day-of-week'>
                        <Button value={1} onClick={this.selectDayOfWeek}>
                            Sun
                        </Button>
                        <Button value={2} onClick={this.selectDayOfWeek}>
                            Mon
                        </Button>
                        <Button value={3} onClick={this.selectDayOfWeek}>
                            Tue
                        </Button>
                        <Button value={4} onClick={this.selectDayOfWeek}>
                            Wed
                        </Button>
                        <Button value={5} onClick={this.selectDayOfWeek}>
                            Thur
                        </Button>
                        <Button value={6} onClick={this.selectDayOfWeek}>
                            Fri
                        </Button>
                        <Button value={7} onClick={this.selectDayOfWeek}>
                            Sat
                        </Button>
                    </ButtonGroup>
                </Row>
                <br/>
                <InputGroup>
                    <InputGroupText>
                        Location:
                    </InputGroupText>
                    <Input onChange={this.setEventLocation} />
                </InputGroup>
                <br/>
                <ListGroup>
                    <ListGroupItem                             
                    action
                    active
                    href="#"
                    tag="a"
                    >
                    Your Event:
                    </ListGroupItem>
                    <ListGroupItem>
                        Name: {this.state.event_name_input}
                    </ListGroupItem>
                    <ListGroupItem>
                        Type: {this.state.event_type_selected}
                    </ListGroupItem>
                    <ListGroupItem>
                        Priority: {this.getPriorityStr(this.state.event_priority_selected)}
                    </ListGroupItem>
                    <ListGroupItem>
                        Time Frame: {this.state.event_start_input}{this.state.event_start_frame_selected} - {this.state.event_end_input}{this.state.event_end_frame_selected}
                    </ListGroupItem>
                    <ListGroupItem>
                        Day(s) of the Week: {this.props.getDayStr(this.state.days_selected)}
                    </ListGroupItem>
                    <ListGroupItem>
                        Location: {this.state.event_location_input}
                    </ListGroupItem>
                </ListGroup>
            </ModalBody>
            <ModalFooter>
                <Button id='event-save-button' color='primary' onClick={this.saveEvent}>
                    Save
                </Button>
                <Popover target='event-save-button' isOpen={this.state.view_save_error_message}>
                    <PopoverHeader>
                        Error:
                    </PopoverHeader>
                    <PopoverBody>
                        {this.state.save_error_message}
                    </PopoverBody>
                </Popover>
                <Modal isOpen={this.state.view_event_created_modal}>
                    <ModalHeader close={<Button onClick={this.closeBothModals} close/>}>
                        Event Saved!
                    </ModalHeader>
                </Modal>
            </ModalFooter>
        </Modal>
        );
    }
}

export default CreateNewEvent