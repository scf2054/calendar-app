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

            event_type_selected: 'Event Type',
            event_priority_selected: 1,
            event_start_frame_selected: null,
            event_end_frame_selected: null,
            day_of_week_selected: 1,
            event_name_input: "'replace me'",
            event_start_input: '0:00',
            event_end_input: '0:00',
            event_location_input: null
        }
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

    getTypeFromDropdown=(event)=> {
        this.toggleTypePopover(event.target.value);
    }

    selectEventType=(event)=> {
        let type = event.target.value;
        this.setState({event_type_selected: type}, () => {console.log(this.state.event_type_selected)});
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
        this.setState({day_of_week_selected: parseInt(event.target.value)});
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
                Create New Event
            </ModalHeader>
            <ModalBody>
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
                                {this.state.event_type_selected}
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
                        Day of the Week: {this.props.getDayStr(this.state.day_of_week_selected)}
                    </ListGroupItem>
                    <ListGroupItem>
                        Location: {this.state.event_location_input}
                    </ListGroupItem>
                </ListGroup>
            </ModalBody>
            <ModalFooter>
                <Button color='primary' onClick={this.props.toggleCreateEvent}>
                    Save
                </Button>
            </ModalFooter>
        </Modal>
        );
    }
}

export default CreateNewEvent