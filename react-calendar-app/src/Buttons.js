import './Buttons.css';

import React, { Component } from 'react';
import { Row, Col, Table, Container, Button } from 'reactstrap';

class Buttons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initialize: true
        }
    }

    render() {
        return (
            <Button>Button</Button>
        );
    }
}

export default Buttons