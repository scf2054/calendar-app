import React, { Component } from 'react';
import { Row, Col } from 'reactstrap'

class Calendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initial: "Calendar"
        }
    }

    render() {
        return (
            <Row>
                <Col>
                    {this.state.initial}
                </Col>
            </Row>
        );
    }
}

export default Calendar