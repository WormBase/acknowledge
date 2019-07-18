import React from 'react';
import {Col, Container, Row, Tab, Tabs} from "react-bootstrap";
import Message from "../components/Message";
import PaginatedSearchList from "../components/PaginatedSearchList";
import Badge from "react-bootstrap/Badge";

class Lists extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            token_valid: undefined,
            num_waiting: 0,
            num_completed: 0,
            num_partial: 0
        };

        this.getPapersFromToken = this.getPapersFromToken.bind(this);
        this.getTitleBadgeNum = this.getTitleBadgeNum.bind(this);
    }

    componentDidMount() {
        this.getPapersFromToken();
    }

    getPapersFromToken() {
        let payload = { passwd: this.props.token };
        if (payload.passwd !== undefined && payload.passwd !== "undefined") {
            this.setState({isLoading: true});
            fetch(process.env.REACT_APP_API_DB_READ_ENDPOINT + "/is_token_valid", {
                method: 'POST',
                headers: {
                    'Accept': 'text/html',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            }).then(res => {
                if (res.status === 200) {
                    return res.json();
                } else {
                }
            }).then(data => {
                if (data === undefined) {
                } else {
                    if (data["token_valid"] === "True") {
                        this.setState({
                            token_valid: true
                        });
                        this.getTitleBadgeNum("get_processed_papers", 1);
                        this.getTitleBadgeNum("get_submitted_papers", 2);
                        this.getTitleBadgeNum("get_partial_papers", 3);
                    } else {
                        this.setState({token_valid: false})
                    }
                }
            }).catch((err) => {
                alert(err);
            });
        }
    }

    getTitleBadgeNum(endpoint, index) {
        let payload = {
                from: 0,
                count: 1,
                passwd: this.props.token
            };
            fetch(process.env.REACT_APP_API_DB_READ_ENDPOINT + "/" + endpoint, {
                method: 'POST',
                headers: {
                    'Accept': 'text/html',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            }).then(res => {
                if (res.status === 200) {
                    return res.json();
                } else {
                    alert("Error")
                }
            }).then(data => {
                if (data === undefined) {
                    alert("Empty response")
                }
                switch (index) {
                    case 1: {
                        this.setState({num_waiting: data["total_num_ids"]});
                        break;
                    }
                    case 2: {
                        this.setState({num_completed: data["total_num_ids"]});
                        break;
                    }
                    case 3: {
                        this.setState({num_partial: data["total_num_ids"]});
                        break;
                    }
                }

            }).catch((err) => {
                alert(err);
            });
    }

    render() {
        let waitingsub_title = <span>Papers waiting for data submission <Badge variant="danger">{this.state.num_waiting}</Badge></span>;
        let completed_title = <span>Data submission completed <Badge variant="success">{this.state.num_completed}</Badge></span>;
        let partial_title = <span>Partial data submission <Badge variant="warning">{this.state.num_partial}</Badge></span>;
        let content = "";
        if (this.state.token_valid) {
            content =
                <Container fluid>
                    <Row>
                        <Col sm="12">
                            &nbsp;
                        </Col>
                    </Row>
                    <Row>
                        <Col sm="12">
                            <h2 className="text-center">Your Author First Pass papers</h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm="12">
                            &nbsp;
                        </Col>
                    </Row>
                    <Row>
                        <Col sm="12">
                            <Tabs defaultActiveKey="1" id="uncontrolled-tab-example">
                                <Tab eventKey="1" title={waitingsub_title}>
                                    <PaginatedSearchList endpoint="get_processed_papers" papersPerPage="10"
                                                         passwd={this.props.token}/>
                                </Tab>
                                <Tab eventKey="2" title={completed_title}>
                                    <PaginatedSearchList endpoint="get_submitted_papers" papersPerPage="10"
                                                         passwd={this.props.token}/>
                                </Tab>
                                <Tab eventKey="3" title={partial_title}>
                                    <PaginatedSearchList endpoint="get_partial_papers" papersPerPage="10"
                                                         passwd={this.props.token}/>
                                </Tab>
                            </Tabs>
                        </Col>
                    </Row>
            </Container>;
        } else if  (this.state.token_valid === undefined) {
            content = <Message subtitle="Loading data ..." />
        } else {
            content = <Message title="Error" subtitle="The provided token is not valid or expired" />
        }
        return(
            <div> {content} </div>
        );
    }
}

export default Lists;