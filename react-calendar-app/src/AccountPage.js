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
            view_date_error: false,
            date_error_message: "Make sure the dates you input are in correct formatting: 'dd-mm-yyyy'"
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

    closeDateError=()=> {
        this.setState({view_date_error: false});
    }

    setSemesterStart=(event)=> {
        this.setState({semester_start: event.target.value});
      }
    
      setSemesterEnd=(event)=> {
        this.setState({semester_end: event.target.value});
      }

    saveSemesterDates=()=> {
        try {
            const start_split = this.state.semester_start.split("-");
            const end_split = this.state.semester_end.split("-");
            const start_d = start_split[0];
            const start_m = start_split[1];
            const start_y = start_split[2];
            const end_d = end_split[0];
            const end_m = end_split[1];
            const end_y = end_split[2];
            if(start_d.length !== 2 || end_d.length !== 2 || start_m.length !== 2 || end_m.length !== 2 || start_y.length !== 4 || end_y.length !== 4) {
                throw TypeError("Time inputted does not fit format 'dd-mm-yyyy'.");
            }
            const start_d_num = parseInt(start_d);
            const start_m_num = parseInt(start_m);
            const start_y_num = parseInt(start_y);
            const end_d_num = parseInt(end_d);
            const end_m_num = parseInt(end_m);
            const end_y_num = parseInt(end_y);
            const months_31 = [1, 3, 5, 7, 8, 10, 12];
            const months_30 = [4, 6, 9, 11];
            const start_is_leap_year = start_y_num % 4 === 0;
            const end_is_leap_year = end_y_num % 4 === 0;
            if(start_m_num === 2 && ((start_is_leap_year && start_d_num > 29) || (!start_is_leap_year && start_d_num > 28))) {
                throw TypeError("Start date is out of range.");
            } else if(
                start_y_num < 1900 || start_y_num > 2100 ||
                (months_31.includes(start_m_num) && start_d_num > 31) ||
                (months_30.includes(start_m_num) && start_d_num > 30) ||
                start_d_num < 1
            ) {
                throw TypeError("Start date is out of range.");
            }
            if(end_m_num === 2 && ((end_is_leap_year && end_d_num > 29) || (!end_is_leap_year && end_d_num > 28))) {
                throw TypeError("End date is out of range.");
            } else if(
                end_y_num < 1900 || end_y_num > 2100 ||
                (months_31.includes(end_m_num) && end_d_num > 31) ||
                (months_30.includes(end_m_num) && end_d_num > 30) ||
                end_d_num < 1
            ) {
                throw TypeError("End date is out of range.");
            } 
            if(new Date(this.state.semester_start) > new Date(this.state.semester_end)) {
                throw TypeError("The end date must come after the start date.")
            }
            this.props.setSemesterStart({
                'day': start_d_num, 
                'month': start_m_num, 
                'year': start_y_num
            });
            this.props.setSemesterEnd({
                'day': end_d_num, 
                'month': end_m_num, 
                'year': end_y_num
            });        
            this.props.toggleAccountPage();
            this.toggleCreateUserSuccess();
        } catch(e) {
            if(e instanceof TypeError) {
                this.setState({date_error_message: e.message})
            } else {
                this.setState({date_error_message: "Make sure the dates you input are in correct formatting: 'dd-mm-yyyy'"});
            }
            this.setState({view_date_error: true});
            console.log(e);
        }
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
                                <label htmlFor='semester-start'>(These values cannot be changed once saved)</label>
                                <InputGroup id='semester-start'>
                                    <InputGroupText>
                                        When does your semester start?
                                    </InputGroupText>
                                    <Input className='semester-start' onClick={this.closeDateError} onChange={this.setSemesterStart} placeholder='dd-mm-yyyy' />
                                </InputGroup>
                                <br />
                                <InputGroup>
                                    <InputGroupText>
                                        When does your semester end?
                                    </InputGroupText>
                                    <Input className='semester-end' onClick={this.closeDateError} onChange={this.setSemesterEnd} placeholder='dd-mm-yyyy' />
                                </InputGroup>
                                <br />
                            </ModalBody>
                            <ModalFooter>
                                <Button onClick={this.saveSemesterDates} color='primary' className='happy-planning' id='happy-planning'>
                                    Happy planning!
                                </Button>
                                <Popover target='happy-planning' isOpen={this.state.view_date_error}>
                                    <PopoverHeader>
                                        Error:
                                    </PopoverHeader>
                                    <PopoverBody>
                                        {this.state.date_error_message}
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