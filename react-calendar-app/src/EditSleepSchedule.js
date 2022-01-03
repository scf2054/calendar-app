import './EditSleepSchedule.css';

import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalHeader, ButtonGroup, Row, Input, ModalFooter, ListGroup, ListGroupItem } from 'reactstrap';

class EditSleepSchedule extends Component {
    constructor(props) {
        super(props);
        this.state =  {
            days_selected: {
                '1': true,
                '2': false,
                '3': false,
                '4': false,
                '5': false,
                '6': false,
                '7': false
            },
            wake_up_time: null,
            wake_up_frame: null,
            sleep_time: null,
            sleep_frame: null
        }
    }

    // Create a function that changed each sleep time frame for each day inputted for the specific user

    selectDayOfWeek=(event)=> {
        const key = event.target.value;
        const value = !this.state.days_selected[key];
        const new_selected = Object.assign(this.state.days_selected, {[key]: value});
        this.setState({days_selected: new_selected});
    }

    getBsStyle=(key)=> {
        return this.state.days_selected[key] ? 'primary': 'default';
    }

    setTime=(event)=> {
        const wake_sleep = event.target.className.split(" ")[0];
        const time = event.target.value;
        if(wake_sleep === 'wake') {
            this.setState({wake_up_time: time});
        } else if(wake_sleep === 'sleep') {
            this.setState({sleep_time: time});
        }
    }

    selectEventFrame=(event)=> {
        const wake_sleep = event.target.className.split(" ")[0];
        const frame = event.target.value;
        if(wake_sleep === 'wake') {
            this.setState({wake_up_frame: frame});
        } else if(wake_sleep === 'sleep') {
            this.setState({sleep_frame: frame});
        }
    }

    resetInputs=()=> {
        this.setState({days_selected: {
            '1': true,
            '2': false,
            '3': false,
            '4': false,
            '5': false,
            '6': false,
            '7': false
        }});
        this.setState({wake_up_time: null});
        this.setState({wake_up_frame: null});
        this.setState({sleep_time: null});
        this.setState({sleep_frame: null});
    }

    render() {
        return (
            <Modal className='edit-sleep-modal' isOpen={this.props.view_edit_sleep}>
                <ModalHeader close={<Button onClick={this.props.toggleEditSleep} close/>}>
                    Edit Sleep Schedule for {this.props.current_user ? this.props.current_user[1] : null}:
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <label htmlFor='day-of-week'>Day of the Week (required):</label>
                        <ButtonGroup className='days-of-week' id='day-of-week'>
                            <Button value={1} onClick={this.selectDayOfWeek} bsStyle={this.getBsStyle('1')}>
                                Sun
                            </Button>
                            <Button value={2} onClick={this.selectDayOfWeek} bsStyle={this.getBsStyle('2')}>
                                Mon
                            </Button>
                            <Button value={3} onClick={this.selectDayOfWeek} bsStyle={this.getBsStyle('3')}>
                                Tue
                            </Button>
                            <Button value={4} onClick={this.selectDayOfWeek} bsStyle={this.getBsStyle('4')}>
                                Wed
                            </Button>
                            <Button value={5} onClick={this.selectDayOfWeek} bsStyle={this.getBsStyle('5')}>
                                Thur
                            </Button>
                            <Button value={6} onClick={this.selectDayOfWeek} bsStyle={this.getBsStyle('6')}>
                                Fri
                            </Button>
                            <Button value={7} onClick={this.selectDayOfWeek} bsStyle={this.getBsStyle('7')}>
                                Sat
                            </Button>
                        </ButtonGroup> 
                    </Row>
                    <br/>
                    <label>
                        When would you like to wake up?
                    </label>      
                    <Input className='wake' placeholder='00:00' onChange={this.setTime} />    
                    <ButtonGroup>
                        <Button className='wake' value='am' onClick={this.selectEventFrame}>AM</Button>
                        <Button className='wake' value='pm' onClick={this.selectEventFrame}>PM</Button>
                    </ButtonGroup>
                    <br/>
                    <label>
                        When would you like to go to sleep?
                    </label>      
                    <Input className='sleep' placeholder='00:00' onChange={this.setTime} />  
                    <ButtonGroup>
                        <Button className='sleep' value='am' onClick={this.selectEventFrame}>AM</Button>
                        <Button className='sleep' value='pm' onClick={this.selectEventFrame}>PM</Button>
                    </ButtonGroup> 
                    <br/>
                    <br/>
                    <ListGroup>
                        <ListGroupItem
                        action
                        active
                        href="#"
                        tag="a"
                        >
                        Your Sleep Schedule:
                        </ListGroupItem>
                        <ListGroupItem>
                            Day(s) of the Week: {this.props.getDayStr(this.state.days_selected)}
                        </ListGroupItem>
                        <ListGroupItem>
                            Waking up: {this.state.wake_up_time}{this.state.wake_up_frame}
                        </ListGroupItem>
                        <ListGroupItem>
                            Going to Sleep: {this.state.sleep_time}{this.state.sleep_frame}
                        </ListGroupItem>
                    </ListGroup>      
                </ModalBody>
                <ModalFooter>
                    <Button color='primary' onClick={this.props.toggleEditSleep}>
                        Save
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default EditSleepSchedule;