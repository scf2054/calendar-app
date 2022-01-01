import './EditSleepSchedule.css';

import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalHeader, ButtonGroup, Row, Input, ModalFooter } from 'reactstrap';

class EditSleepSchedule extends Component {
    constructor(props) {
        super(props);
        this.state =  {
            day_of_week_selected: 1,
            wake_up_time: '00:00',
            sleep_time: '00:00'
        }
    }

    selectDayOfWeek=(event)=> {
        this.setState({day_of_week_selected: parseInt(event.target.value)});
    }

    setWakeUpTime=(event)=> {
        this.setState({wake_up_time: event.target.value}, () => {console.log(this.state.wake_up_time)});
    }

    setSleepTime=(event)=> {
        this.setState({sleep_time: event.target.value}, () => {console.log(this.state.sleep_time)});
    }

    render() {
        return (
            <Modal className='edit-sleep-modal' isOpen={this.props.view_edit_sleep}>
                <ModalHeader close={<Button onClick={this.props.toggleEditSleep} close/>}>
                    Edit Sleep Schedule
                </ModalHeader>
                <ModalBody>
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
                    <label>
                        When would you like to wake up on {this.props.getDayStr(this.state.day_of_week_selected)}?
                    </label>      
                    <Input placeholder='00:00' onChange={this.setWakeUpTime} />    
                    <br/>
                    <label>
                        When would you like to go to sleep on {this.props.getDayStr(this.state.day_of_week_selected)}?
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