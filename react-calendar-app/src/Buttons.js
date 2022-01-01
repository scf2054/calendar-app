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

    
    render() {
        return (
            <>
                <Col>
                    <Button
                        color='info'
                        outline
                        onClick={this.props.toggleEditSleep}
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
            </>
        );
    }
}

export default Buttons