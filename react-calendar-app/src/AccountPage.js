import './AccountPage.css';

import React, { Component } from 'react';
import { Modal, ModalHeader, Button, ModalBody, InputGroup, Input } from 'reactstrap';

class AccountPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            placeholder: false
        }
    }

    render() {
        return (
            <Modal isOpen={this.props.view_account_page}>
                <ModalHeader close={<Button onClick={this.props.toggleAccountPage} close/>}>
                    Create and account or sign-in to an existing one
                </ModalHeader>
                <ModalBody>
                    <label htmlFor='username-input'>Create an Account: </label>
                    <InputGroup id='username-input'>
                        <Input placeholder='Enter a username...' />
                        <Button onClick={this.props.toggleAccountPage}>
                            Create
                        </Button>
                    </InputGroup>
                    <br/>
                    <label htmlFor='id-input'>Sign-in: </label>
                    <InputGroup id='id-input'>
                        <Input placeholder='Enter the ID that was given to you...'/>
                        <Button>
                            Sign-in
                        </Button>
                    </InputGroup>
                    <br/>
                </ModalBody>
            </Modal>
        );
    }
}

export default AccountPage;