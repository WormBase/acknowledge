import React from 'react';
import LoadingOverlay from 'react-loading-overlay';
import {
    Badge,
    ControlLabel,
    ListGroup,
    ListGroupItem,
    Pagination
} from "react-bootstrap";
import {Link} from "react-router-dom";

class PaginatedPapersList extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            list_papers: [],
            num_papers: 0,
            from_offset: 0,
            active_page: 1,
            cx: 0,
            isLoading: false,
            refresh_list: this.props.refreshList,
            countValidationState: null
        };
        this.loadDataFromAPI = this.loadDataFromAPI.bind(this);
        this.refreshList = this.refreshList.bind(this);
    }

    componentDidMount() {
        this.loadDataFromAPI();
    }

    componentDidUpdate() {
        if (this.state.refresh_list === true) {
            this.loadDataFromAPI();
            this.setState({refresh_list: false});
        }
    }

    refreshList() {
        this.setState({active_page: 1, from_offset: 0, refresh_list: true});
    }

    loadDataFromAPI() {
        this.setState({isLoading: true});
        let payload = {
            from: this.state.from_offset,
            count: this.props.papersPerPage,
            list_type: this.props.listType
        };
        fetch(process.env.REACT_APP_API_DB_READ_ADMIN_ENDPOINT + "/papers", {
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
            this.setState({
                list_papers: data["list_ids"],
                num_papers: data["total_num_ids"],
                isLoading: false
            });
        }).catch((err) => {
            alert(err);
        });
    }

    render() {

        let items = [];
        if (this.state.active_page > 3 && Math.ceil(this.state.num_papers / this.props.papersPerPage) > 4) {
            items.push(
                <Pagination.Ellipsis onClick={() => {
                                     this.setState({
                                         active_page: this.state.active_page - 2,
                                         from_offset: (this.state.active_page - 3) * this.props.papersPerPage,
                                         refresh_list: true
                                     });
                                 }}/>);
        }
        for (let number = Math.max(this.state.active_page - 2, 1);
             number <= Math.min(Math.ceil(this.state.num_papers / this.props.papersPerPage), this.state.active_page + 2);
             number++) {
            items.push(
                <Pagination.Item key={number} active={number === this.state.active_page}
                                 onClick={() => {
                                     this.setState({
                                         active_page: number,
                                         from_offset: (number - 1) * this.props.papersPerPage,
                                         refresh_list: true
                                     });
                                 }}>
                    {number}
                </Pagination.Item>,
            );
        }
        if ((Math.ceil(this.state.num_papers / this.props.papersPerPage) - this.state.active_page) > 2 && Math.ceil(this.state.num_papers / this.props.papersPerPage) > 4) {
            items.push(
                <Pagination.Ellipsis onClick={() => {
                                     this.setState({
                                         active_page: this.state.active_page + 2,
                                         from_offset: (this.state.active_page + 1) * this.props.papersPerPage,
                                         refresh_list: true
                                     });
                                 }}/>);
        }
        return(
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-12">
                        &nbsp;
                    </div>
                </div>
                <LoadingOverlay
                    active={this.state.isLoading}
                    spinner
                    text='Loading paper data...'
                    styles={{
                        overlay: (base) => ({
                            ...base,
                            background: 'rgba(65,105,225,0.5)'
                        })
                    }}
                >
                    <div className="row">
                        <div className="col-sm-12">
                            <ControlLabel>Number of papers:</ControlLabel> <Badge>{this.state.num_papers}</Badge>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <Pagination>
                                <Pagination.First onClick={() => {this.setState({
                                    active_page: 1,
                                    from_offset: 0,
                                    refresh_list: true})}} />
                                <Pagination.Prev onClick={() => {
                                    if (this.state.active_page > 1) {
                                        this.setState({
                                            active_page: this.state.active_page - 1,
                                            from_offset: parseInt(this.state.from_offset) - parseInt(this.props.papersPerPage),
                                            refresh_list: true})
                                    }}} />
                                {items}
                                <Pagination.Next onClick={() => {
                                    if (this.state.active_page <  Math.ceil(this.state.num_papers / this.props.papersPerPage)) {
                                        this.setState({
                                            active_page: this.state.active_page + 1,
                                            from_offset: parseInt(this.state.from_offset) + parseInt(this.props.papersPerPage),
                                            refresh_list: true});
                                }}} />
                                <Pagination.Last onClick={() => {this.setState({
                                    active_page: Math.ceil(this.state.num_papers / this.props.papersPerPage),
                                    from_offset: (Math.ceil(this.state.num_papers / this.props.papersPerPage) - 1) * this.props.papersPerPage,
                                    refresh_list: true})}} />
                            </Pagination>
                            <ListGroup>
                                {[...this.state.list_papers].map(item =>
                                    <ListGroupItem>
                                        <Link to={{pathname: '/paper', search: '?paper_id=' + item}}>{item}</Link>
                                    </ListGroupItem>)}
                            </ListGroup>
                        </div>
                    </div>
                </LoadingOverlay>
            </div>
        );
    }
}

export default PaginatedPapersList;