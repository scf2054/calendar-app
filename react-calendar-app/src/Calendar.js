import React, { Component } from 'react';
import { Row, Col, Table } from 'reactstrap'

class Calendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initial: "Calendar"
        }
    }

    render() {
        return (
            <Table striped bordered>
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Sunday</th>
                        <th>Monday</th>
                        <th>Tuesday</th>
                        <th>Wednesday</th>
                        <th>Thursday</th>
                        <th>Friday</th>
                        <th>Saturday</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope='row'>
                            7:00am
                        </th>
                    </tr>
                    <tr>
                        <th scope='row'>
                            8:00am
                        </th>
                    </tr>
                    <tr>
                        <th scope='row'>
                            9:00am
                        </th>
                    </tr>
                    <tr>
                        <th scope='row'>
                            10:00am
                        </th>
                    </tr>
                    <tr>
                        <th scope='row'>
                            11:00am
                        </th>
                    </tr>
                    <tr>
                        <th scope='row'>
                            12:00pm
                        </th>
                    </tr>
                    <tr>
                        <th scope='row'>
                            1:00pm
                        </th>
                    </tr>
                    <tr>
                        <th scope='row'>
                            2:00pm
                        </th>
                    </tr>
                    <tr>
                        <th scope='row'>
                            3:00pm
                        </th>
                    </tr>
                    <tr>
                        <th scope='row'>
                            4:00pm
                        </th>
                    </tr>
                    <tr>
                        <th scope='row'>
                            5:00pm
                        </th>
                    </tr>
                    <tr>
                        <th scope='row'>
                            6:00pm
                        </th>
                    </tr>
                    <tr>
                        <th scope='row'>
                            7:00pm
                        </th>
                    </tr>
                    <tr>
                        <th scope='row'>
                            8:00pm
                        </th>
                    </tr>
                    <tr>
                        <th scope='row'>
                            9:00pm
                        </th>
                    </tr>
                    <tr>
                        <th scope='row'>
                            10:00pm
                        </th>
                    </tr>
                    <tr>
                        <th scope='row'>
                            11:00pm
                        </th>
                    </tr>
                </tbody>
            </Table>
        );
    }
}

export default Calendar