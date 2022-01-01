import './EditSleepSchedule.css';

import React, { Component } from 'react';
import { Button, Modal, ModalHeader } from 'reactstrap';

class EditSleepSchedule extends Component {
    constructor(props) {
        super(props);
        this.state =  {
            placeholder: false
        }
    }

    render() {
        return (
            <Modal className='edit-sleep-modal' isOpen={this.props.view_edit_sleep}>
                <ModalHeader close={<Button onClick={this.props.toggleEditSleep} close/>}>
                    Edit Sleep Schedule
                </ModalHeader>
            </Modal>
        );
    }
}

export default EditSleepSchedule;