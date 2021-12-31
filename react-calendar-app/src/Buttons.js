import './Buttons.css';

import React, { Component } from 'react';
import { Col, Button, Modal, ModalHeader } from 'reactstrap';

class Buttons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            view_edit_sleep: false,
        }
    }

    toggleEditSleep=(event)=> {
        this.setState({view_edit_sleep: !this.state.view_edit_sleep});
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
                        onClick={this.props.toggleCreateEvent}
                    >
                        Create Event
                    </Button>
                </Col>
                <Modal className='edit-sleep-modal' isOpen={this.state.view_edit_sleep}>
                    <ModalHeader close={<Button onClick={this.toggleEditSleep} close/>}>
                        Edit Sleep Schedule
                    </ModalHeader>
                </Modal>
            </>
        );
    }
}

export default Buttons