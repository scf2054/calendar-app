import './Buttons.css';

import React, { Component } from 'react';
import { Row, Col, Table, Container, Button, Modal, ModalHeader, ModalBody, InputGroup, InputGroupText, Input, Dropdown, DropdownToggle, DropdownItem, DropdownMenu, Popover, PopoverHeader, PopoverBody } from 'reactstrap';

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
            view_other_popover: false
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

    toggleWorkPopover=(event)=> {
        this.setState({view_work_popover: !this.state.view_work_popover});
    }

    toggleSchoolPopover=(event)=> {
        this.setState({view_school_popover: !this.state.view_school_popover});
    }

    toggleSpecialPopover=(event)=> {
        this.setState({view_special_popover: !this.state.view_special_popover});
    }

    toggleOtherPopover=(event)=> {
        this.setState({view_other_popover: !this.state.view_other_popover});
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
                        <Dropdown className='event-type-dropdown' onClick={this.toggleEventTypeDropdown} isOpen={this.state.view_event_type_dropdown}>
                            <DropdownToggle caret>
                                Event Type
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem header>
                                    All Different Event Types
                                </DropdownItem>
                                <DropdownItem id='work-item' onMouseEnter={this.toggleWorkPopover} onMouseLeave={this.toggleWorkPopover}>
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
                                <DropdownItem id='school-item' onMouseEnter={this.toggleSchoolPopover} onMouseLeave={this.toggleSchoolPopover}>
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
                                <DropdownItem id='special-item' onMouseEnter={this.toggleSpecialPopover} onMouseLeave={this.toggleSpecialPopover}>
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
                                <DropdownItem id='other-item' onMouseEnter={this.toggleOtherPopover} onMouseLeave={this.toggleOtherPopover}>
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
                    </ModalBody>
                </Modal>
            </>
        );
    }
}

export default Buttons