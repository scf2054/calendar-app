import './EditSleepSchedule.css';

import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalHeader, ButtonGroup, Row, Input, ModalFooter, ListGroup, ListGroupItem, Popover, PopoverHeader, PopoverBody } from 'reactstrap';

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
            wake_up_time: '7:00',
            wake_up_frame: 'am',
            sleep_time: '11:00',
            sleep_frame: 'pm',
            save_error_message: null,
            view_save_error_message: false
        }
    }

    // Create a function that changed each sleep time frame for each day inputted for the specific user
    saveSleep=()=> {
        try {
            const wake_up = this.props.convertTime(this.state.wake_up_time, this.state.wake_up_frame);
            const sleep = this.props.convertTime(this.state.sleep_time, this.state.sleep_frame);
            let no_days_selected = true;
            for(let day_id in this.state.days_selected) {
                if(this.state.days_selected[day_id]) {
                    no_days_selected = false;
                    this.putSleep(day_id, wake_up, sleep);
                }
            }
            if(no_days_selected) {
                throw SyntaxError("No days have been selected.");
            }
            this.props.toggleEditSleep();
            this.resetInputs();
        } catch(e) {
            this.setState({save_error_message: e.message});
            this.setState({view_save_error_message: true});
            console.log(e);
        }
    }

    putSleep=(day_id, wake_up, sleep)=> {
        fetch('/events/user/' + this.props.current_user[0] + '/sleep/' + day_id)
        .then(response => response.json())
        .then(data => {
            const event_id = data[0];
            return fetch('/events/' + event_id, {
                method: 'PUT',
                body: JSON.stringify({
                    'start_time': sleep,
                    'end_time': wake_up
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
        })
        .then(response => {
            if(response.status >= 200 && response.status < 300) {
                return response.json();
            } else if(response.status === 406) {
                alert("This new time overlaps with a high priority event, failed to update calendar...");
            }
        }) 
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
        this.setState({wake_up_time: '7:00'});
        this.setState({wake_up_frame: 'am'});
        this.setState({sleep_time: '11:00'});
        this.setState({sleep_frame: 'pm'});
    }

    render() {
        return (
            <Modal className='edit-sleep-modal' isOpen={this.props.view_edit_sleep}>
                <ModalHeader close={<Button onClick={this.props.toggleEditSleep} close/>}>
                    Edit Sleep Schedule for {this.props.current_user ? this.props.current_user[1] : null}:
                </ModalHeader>
                <ModalBody onClick={() => this.setState({view_save_error_message: false})}>
                    <Row>
                        <label htmlFor='day-of-week'>Day of the Week (required):</label>
                        <ButtonGroup className='days-of-week' id='day-of-week'>
                            <Button value={1} onClick={this.selectDayOfWeek} bsstyle={this.getBsStyle('1')}>
                                Sun
                            </Button>
                            <Button value={2} onClick={this.selectDayOfWeek} bsstyle={this.getBsStyle('2')}>
                                Mon
                            </Button>
                            <Button value={3} onClick={this.selectDayOfWeek} bsstyle={this.getBsStyle('3')}>
                                Tue
                            </Button>
                            <Button value={4} onClick={this.selectDayOfWeek} bsstyle={this.getBsStyle('4')}>
                                Wed
                            </Button>
                            <Button value={5} onClick={this.selectDayOfWeek} bsstyle={this.getBsStyle('5')}>
                                Thur
                            </Button>
                            <Button value={6} onClick={this.selectDayOfWeek} bsstyle={this.getBsStyle('6')}>
                                Fri
                            </Button>
                            <Button value={7} onClick={this.selectDayOfWeek} bsstyle={this.getBsStyle('7')}>
                                Sat
                            </Button>
                        </ButtonGroup> 
                    </Row>
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
                    <label>
                        When would you like to wake up?
                    </label>      
                    <Input className='wake' placeholder='00:00' onChange={this.setTime} />    
                    <ButtonGroup>
                        <Button className='wake' value='am' onClick={this.selectEventFrame}>AM</Button>
                        <Button className='wake' value='pm' onClick={this.selectEventFrame}>PM</Button>
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
                            Going to Sleep: {this.state.sleep_time}{this.state.sleep_frame}
                        </ListGroupItem>
                        <ListGroupItem>
                            Waking up: {this.state.wake_up_time}{this.state.wake_up_frame}
                        </ListGroupItem>
                    </ListGroup>      
                </ModalBody>
                <ModalFooter>
                    <Button id='sleep-save-button' color='primary' onClick={this.saveSleep}>
                        Save
                    </Button>
                    <Popover target='sleep-save-button' isOpen={this.state.view_save_error_message}>
                        <PopoverHeader>
                            Error:
                        </PopoverHeader>
                        <PopoverBody>
                            {this.state.save_error_message}
                        </PopoverBody>
                    </Popover>
                </ModalFooter>
            </Modal>
        );
    }
}

export default EditSleepSchedule;