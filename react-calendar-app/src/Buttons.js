import './Buttons.css';

import React, { Component } from 'react';
import { Row, Col, Table, Container, Button, Modal, ModalHeader } from 'reactstrap';

class Buttons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            view_edit_sleep: false,
            view_create_event: false
        }
    }

    toggleEditSleep=(event)=> {
        this.setState({view_edit_sleep: !this.state.view_edit_sleep});
    }

    toggleCreateEvent=(event)=> {
        this.setState({view_create_event: !this.state.view_create_event});
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
                </Modal>
            </>
        );
    }
}

export default Buttons