import './EditSleepSchedule.css';

import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalHeader, ButtonGroup, Row, Input, ModalFooter } from 'reactstrap';

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
            wake_up_time: '00:00',
            sleep_time: '00:00'
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

    setWakeUpTime=(event)=> {
        this.setState({wake_up_time: event.target.value});
    }

    setSleepTime=(event)=> {
        this.setState({sleep_time: event.target.value});
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
                        When would you like to wake up on {this.props.getDayStr(this.state.days_selected)}?
                    </label>      
                    <Input placeholder='00:00' onChange={this.setWakeUpTime} />    
                    <br/>
                    <label>
                        When would you like to go to sleep on {this.props.getDayStr(this.state.days_selected)}?
                    </label>      
                    <Input placeholder='00:00' onChange={this.setWakeUpTime} />         
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