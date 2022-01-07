import './AccountPage.css';

import React, { Component } from 'react';
import { Modal, ModalHeader, Button, ModalBody, InputGroup, Input, Popover, PopoverHeader, PopoverBody, ButtonGroup, InputGroupText, ModalFooter } from 'reactstrap';

class AccountPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user_entered: null,
            username_created: null,
            id_entered: null,
            id_created: null,
            semester_start: new Date().toISOString(),
            semester_end: new Date().toISOString(),
            view_create_user_success: false,
            view_are_you_sure: false,
            view_id_doesnt_exist: false,
            view_username_exists: false,
        }
    }

    confirmUsername=()=> {
        this.props.setUser(this.state.user_entered);
        this.toggleAreYouSure();
        this.props.toggleAccountPage();
    }

    createNewUser=()=> {
        fetch('/users', {
            method: 'POST',
            body: JSON.stringify({
                'username': this.state.username_created,
                'user_type': 'hybrid'
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => {
            if(response.status >= 200 && response.status < 300) {
                return response.json();
            } else {
                throw Error(response.json());
            }
        })
        .then(json => {
            this.setState({id_created: json});
            this.toggleCreateUserSuccess();
            // re-render the calendar
        })
        .catch(error => {
            this.setState({view_username_exists: true});
            console.log(error)
        })
    }

    signIn=()=> {
        fetch('/users/' + this.state.id_entered)
        .then(response => {
            if(response.status >= 200 && response.status < 300) {
                return response.json();
            } else {
                throw Error(response.json());
            }
        })
        .then(jsonOutput => {
            const user = jsonOutput[0];
            this.toggleAreYouSure();
            this.setState({user_entered: user});
            // re-render the calendar
        })
        .catch(error => {
            this.setState({view_id_doesnt_exist: true});
            console.log(error);
        })
    }

    toggleCreateUserSuccess=()=> {
        this.setState({view_create_user_success: !this.state.view_create_user_success});
    }

    toggleAreYouSure=()=> {
        this.setState({view_are_you_sure: !this.state.view_are_you_sure});
    }

    render() {
        return (
            <Modal isOpen={this.props.view_account_page}>
                <ModalHeader>
                    Create and account or sign-in to an existing one
                </ModalHeader>
                <ModalBody>
                    <label htmlFor='username-input'>Create an Account: </label>
                    <InputGroup id='username-input'>
                        <Input onClick={() => this.setState({view_username_exists: false})} onChange={event => {this.setState({username_created: event.target.value});}} placeholder='Enter a username...' />
                        <Button onClick={this.createNewUser} id='create-account-button'>
                            Create
                        </Button>
                        <Popover target='create-account-button' isOpen={this.state.view_username_exists}>
                            <PopoverHeader>
                                Error when creating user:
                            </PopoverHeader>
                            <PopoverBody>
                                The username "{this.state.username_created}" already exists.
                            </PopoverBody>
                        </Popover>
                        <Modal isOpen={this.state.view_create_user_success}>
                            <ModalHeader close={<Button onClick={this.toggleCreateUserSuccess} close/>}>
                                User Successfully Created!
                            </ModalHeader>
                            <ModalBody>
                                <div>The ID for "{this.state.username_created}" is: </div>
                                <br/>
                                <div className='id'>{this.state.id_created}</div>
                                <br/>
                                <div>Use this to save your calendar so you can sign back into Schedgy.</div>
                                <br />
                                <InputGroup id='semester-start'>
                                    <InputGroupText>
                                        When does your semester start?
                                    </InputGroupText>
                                    <Input className='semester-start' onClick={this.props.closeDateError} onChange={this.props.setSemesterStartStr} placeholder='dd-mm-yyyy' />
                                </InputGroup>
                                <br />
                                <InputGroup>
                                    <InputGroupText>
                                        When does your semester end?
                                    </InputGroupText>
                                    <Input className='semester-end' onClick={this.props.closeDateError} onChange={this.props.setSemesterEndStr} placeholder='dd-mm-yyyy' />
                                </InputGroup>
                                <br />
                            </ModalBody>
                            <ModalFooter>
                                <Button onClick={this.props.saveSemesterDates} color='primary' className='happy-planning' id='happy-planning'>
                                    Happy planning!
                                </Button>
                                <Popover target='happy-planning' isOpen={this.props.view_date_error}>
                                    <PopoverHeader>
                                        Error:
                                    </PopoverHeader>
                                    <PopoverBody>
                                        {this.props.date_error_message}
                                    </PopoverBody>
                                </Popover>
                            </ModalFooter>
                        </Modal>
                    </InputGroup>
                    <br/>
                    <h4>OR</h4>
                    <br/>
                    <label htmlFor='id-input'>Sign-in: </label>
                    <InputGroup id='id-input'>
                        <Input type='number' onClick={() => {this.setState({view_id_doesnt_exist: false})}} onChange={event => {this.setState({id_entered: parseInt(event.target.value)})}} placeholder='Enter the ID that was given to you...'/>
                        <Button id='sign-in-button' onClick={this.signIn}>
                            Sign-in
                        </Button>
                        <Popover flip target='sign-in-button' isOpen={this.state.view_are_you_sure}>
                            <PopoverBody>
                                <div>This is the ID for user: </div>
                                <div className='username-entered'>"{this.state.user_entered ? this.state.user_entered[1] : null}"</div>
                                <div>Is this correct?</div>
                                <br/>
                                <ButtonGroup>
                                    <Button onClick={this.confirmUsername}>
                                        Yes
                                    </Button>
                                    <Button onClick={this.toggleAreYouSure}>
                                        No
                                    </Button>
                                </ButtonGroup>
                            </PopoverBody>
                        </Popover>
                        <Popover target='sign-in-button' isOpen={this.state.view_id_doesnt_exist}>
                            <PopoverHeader>
                                Error
                            </PopoverHeader>
                            <PopoverBody>
                                This ID does not have a user...
                            </PopoverBody>
                        </Popover>
                    </InputGroup>
                    <br/>
                </ModalBody>
            </Modal>
        );
    }
}

export default AccountPage;