import './AccountPage.css';

import React, { Component } from 'react';
import { Modal, ModalHeader, Button, ModalBody, InputGroup, Input, Popover, PopoverHeader, PopoverBody } from 'reactstrap';

class AccountPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            id_entered: null,
            id_created: null,
            view_username_error: false,
            view_create_user_success: false
        }
    }

    setUsername=(event)=> {
        this.setState({username: event.target.value});
    }

    setID=(event)=> {
        this.setState({id_entered: parseInt(event.target.value)});
    }

    createNewUser=()=> {
        fetch('/users', {
            method: 'POST',
            body: JSON.stringify({
                'username': this.state.username,
                'user_type': 'hybrid'
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => {
            if(response.status >= 200 && response.status < 300) {
                return response.json()
            } else {
                throw Error(response.json())
            }
        })
        .then(json => {
            this.setState({id_created: json});
            this.toggleCreateUserSuccess();

        })
        .catch(error => {
            this.setState({view_username_error: true});
            console.log(error)
        })
    }

    toggleCreateUserSuccess=()=> {
        this.setState({view_create_user_success: !this.state.view_create_user_success});
    }

    closeAccountAndSuccessModals=()=> {
        this.toggleCreateUserSuccess();
        this.props.toggleAccountPage();
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
                        <Input onClick={() => {this.setState({view_username_error: false})}} onChange={this.setUsername} placeholder='Enter a username...' />
                        <Button onClick={this.createNewUser} id='create-account-button'>
                            Create
                        </Button>
                        <Popover flip target='create-account-button' isOpen={this.state.view_username_error}>
                            <PopoverHeader>
                                Error when creating user:
                            </PopoverHeader>
                            <PopoverBody>
                                The username "{this.state.username}" already exists.
                            </PopoverBody>
                        </Popover>
                        <Modal isOpen={this.state.view_create_user_success}>
                            <ModalHeader close={<Button onClick={this.closeAccountAndSuccessModals} close/>}>
                                User Successfully Created!
                            </ModalHeader>
                            <ModalBody>
                                <div>The ID for "{this.state.username}" is: </div>
                                <br/>
                                <div className='id'>{this.state.id_created}</div>
                                <br/>
                                <div>Use this to save your calendar so you can sign back into Schedgy.</div>
                                <div className='happy-planning'>Happy planning!</div>
                            </ModalBody>
                        </Modal>
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