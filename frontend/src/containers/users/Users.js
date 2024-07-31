import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Button, Col, Glyphicon, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import * as actions from "./UsersApi";
import {BootstrapTable, TableHeaderColumn} from "react-bootstrap-table";

export class Users extends Component {
    state = {users: null, page: 1, sizePerPage: 10};

    componentDidMount() {
        this.reload();
    }

    reload() {
        const {page, sizePerPage} = this.state;
        this.props.actions.loadUsers({page: page, per_page: sizePerPage},
            users => this.setState({users, page, sizePerPage}));
    }

    delete(id) {
        this.props.actions.deleteUser(id, () => {
            this.reload();
        });
    }



    render() {
        const {users, page, sizePerPage} = this.state;

        return (<div>
                <Row className="vertical-middle breadcrumbs">
                    <Col xs={8}>
                        <h5>
                            <Glyphicon
                                glyph="cog"/> Admin > Users
                        </h5>
                    </Col>
                    <Col xs={4} className="text-right">
                        <h4>
                            <LinkContainer exact to={`/user`}>
                                <Button bsStyle={'success'}><Glyphicon
                                    glyph="plus"/> Add </Button>
                            </LinkContainer>
                        </h4>
                    </Col>
                </Row>
                {users &&
                    <BootstrapTable
                        data={users}
                        fetchInfo={{dataTotalSize: users.length}}
                        striped
                        hover
                        remote
                        pagination
                        bordered={false}
                        options={{
                            onPageChange: (page, sizePerPage) => {
                                this.reload(page, sizePerPage);
                            },
                            onSizePerPageList: sizePerPage => {
                                this.reload(this.state.page, sizePerPage);
                            },
                            page,
                            sizePerPage
                        }}
                    >
                        <TableHeaderColumn width="15" isKey dataField='id'>ID</TableHeaderColumn>
                        <TableHeaderColumn width="40" dataField='email'>Name</TableHeaderColumn>
                        <TableHeaderColumn width="25" dataField='id' dataFormat={(cell, row) => {
                            return <div>
                                <LinkContainer exact to={`/user/${row.id}`}>
                                    <OverlayTrigger placement="top" overlay={
                                        <Tooltip id="tooltip">
                                            Edit
                                        </Tooltip>
                                    }>
                                                    <span className="text-success pointer"> <i
                                                        className="fas fa-edit"/></span>
                                    </OverlayTrigger>
                                </LinkContainer>
                                <span> </span>

                                <LinkContainer to={`/users`} onClick={() => this.delete(row.id)}>
                                    <OverlayTrigger placement="top" overlay={
                                        <Tooltip id="tooltip">
                                            Delete
                                        </Tooltip>
                                    }>
                                                    <span className="text-danger pointer"
                                                          onClick={() => this.delete(row.id)}> <i
                                                        className="fas fa-trash-alt"/></span>
                                    </OverlayTrigger>
                                </LinkContainer>
                            </div>
                        }}>Actions
                        </TableHeaderColumn>

                    </BootstrapTable>
                }
            </div>
        );
    }

}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        actions,
        dispatch)
});

export default connect(
    undefined,
    mapDispatchToProps
)(Users)
