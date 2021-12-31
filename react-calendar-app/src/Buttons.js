import './Buttons.css';

import React, { Component } from 'react';
import { Col, Button, Modal, ModalHeader, ModalBody, InputGroup, InputGroupText, Input, Dropdown, DropdownToggle, DropdownItem, DropdownMenu, Popover, PopoverHeader, PopoverBody, Row, ButtonGroup } from 'reactstrap';

class Buttons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            view_edit_sleep: false,
            view_create_event: false,
            view_event_type_dropdown: false,

            view_work_popover: false,
            view_school_popover: false,
            view_special_popover: false,
            view_other_popover: false,
            view_low_popover: false,
            view_medium_popover: false,
            view_high_popover: false,

            event_type_selected: 'Event Type',
            event_priority_selected: 'low'
        }
    }

    toggleEditSleep=(event)=> {
        this.setState({view_edit_sleep: !this.state.view_edit_sleep});
    }

    toggleCreateEvent=(event)=> {
        this.setState({view_create_event: !this.state.view_create_event});
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
        let priority = event.target.value;
        if(priority === 'low') {
            this.setState({view_low_popover: !this.state.view_low_popover});
        } else if(priority === 'medium') {
            this.setState({view_medium_popover: !this.state.view_medium_popover});
        } else if(priority === 'high') {
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
        this.setState({event_priority_selected: event.target.value});
    }

    render() {
        return (
            <>
                <Col>
                    <Button
                        color='info'
                        outline
                        onClick={this.toggleEditSleep}
                    >
                        Edit Sleep Schedule
                    </Button>
                </Col>
                <Col>
                    <Button
                        color='info'
                        outline
                        onClick={this.toggleCreateEvent}
                    >
                        Create Event
                    </Button>
                </Col>
                <Modal className='edit-sleep-modal' isOpen={this.state.view_edit_sleep}>
                    <ModalHeader close={<Button onClick={this.toggleEditSleep} close/>}>
                        Edit Sleep Schedule
                    </ModalHeader>
                </Modal>
                <Modal className='create-event-modal' isOpen={this.state.view_create_event}>
                    <ModalHeader close={<Button onClick={this.toggleCreateEvent} close/>}>
                        Create New Event
                    </ModalHeader>
                    <ModalBody>
                        <InputGroup>
                            <InputGroupText>
                                Event Name:
                            </InputGroupText>
                            <Input />
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
                                        <DropdownItem value='Work' id='work-item' onMouseEnter={this.getTypeFromDropdown} onMouseLeave={this.getTypeFromDropdown} onClick={this.selectEventType}>
                                            Work
                                        </DropdownItem>
                                        <Popover target='work-item' isOpen={this.state.view_work_popover}>
                                            <PopoverHeader>
                                                Work Event Type
                                            </PopoverHeader>
                                            <PopoverBody>
                                                An event with this type will default to "high" priority. Events like this can include work shifts, meetings, and lunch breaks.
                                            </PopoverBody>
                                        </Popover>
                                        <DropdownItem value='School' id='school-item' onMouseEnter={this.getTypeFromDropdown} onMouseLeave={this.getTypeFromDropdown} onClick={this.selectEventType}>
                                            School
                                        </DropdownItem>
                                        <Popover target='school-item' isOpen={this.state.view_school_popover}>
                                            <PopoverHeader>
                                                School Event Type
                                            </PopoverHeader>
                                            <PopoverBody>
                                                Events like this can include classes, homework, office hours, and group project meetings. If the event priority is set to "high", then a homework event with "low" priority is automatically created for this class and added to the calendar. An event with this type will default to "low" priority.
                                            </PopoverBody>
                                        </Popover>
                                        <DropdownItem value='Special' id='special-item' onMouseEnter={this.getTypeFromDropdown} onMouseLeave={this.getTypeFromDropdown} onClick={this.selectEventType}>
                                            Special
                                        </DropdownItem>
                                        <Popover target='special-item' isOpen={this.state.view_special_popover}>
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
                                        <Popover target='other-item' isOpen={this.state.view_other_popover}>
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
                                    <Button value='low' id='low-button' onMouseEnter={this.togglePriorityPopover} onMouseLeave={this.togglePriorityPopover} onClick={this.selectEventPriority}>
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
                                    <Button value='medium' id='medium-button' onMouseEnter={this.togglePriorityPopover} onMouseLeave={this.togglePriorityPopover} onClick={this.selectEventPriority}>
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
                                    <Button value='high' id='high-button' onMouseEnter={this.togglePriorityPopover} onMouseLeave={this.togglePriorityPopover} onClick={this.selectEventPriority}>
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
                    </ModalBody>
                </Modal>
            </>
        );
    }
}

export default Buttons