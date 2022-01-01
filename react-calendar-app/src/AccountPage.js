import './AccountPage.css';

import React, { Component } from 'react';
import { Modal, ModalHeader, Button, ModalBody, InputGroup, Input } from 'reactstrap';

class AccountPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            id: null
        }
    }

    setUsername=(event)=> {
        this.setState({username: event.target.value});
    }

    setID=(event)=> {
        this.setState({id: parseInt(event.target.value)});
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
                        <Input onChange={this.setUsername} placeholder='Enter a username...' />
                        <Button onClick={this.props.toggleAccountPage}>
                            Create
                        </Button>
                    </InputGroup>
                    <br/>
                    <h4>OR</h4>
                    <br/>
                    <label htmlFor='id-input'>Sign-in: </label>
                    <InputGroup id='id-input'>
                        <Input onChange={this.setID} placeholder='Enter the ID that was given to you...'/>
                        <Button onClick={this.props.toggleAccountPage}>
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