import React, { useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {Button, Col, Glyphicon, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import * as actions from "./UsersApi";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";


const Users = ({ actions }) => {
    const [users, setUsers] = useState(null);
    const [page, setPage] = useState(1);
    const [sizePerPage, setSizePerPage] = useState(10);
    const [showAccessMessage, setShowAccessMessage] = useState(false);


    useEffect(() => {
        reload();

        const timer = setTimeout(() => {
            setShowAccessMessage(true);
        }, 300);

        return () => clearTimeout(timer); // Czyszczenie timera przy odmontowaniu
    }, [page, sizePerPage]);

    const reload = () => {
        actions.loadUsers({ page, per_page: sizePerPage }, setUsers);
    };

    const deleteUser = (id) => {
        actions.deleteUser(id, () => {
        reload();
        });
    };

    return (
        <div>
            {!users && showAccessMessage && (
                <div style={{textAlign: 'center', padding: '50px 20px'}}>
                    <Glyphicon glyph="alert" style={{fontSize: '40px', color: '#d9534f'}}/>
                    <h3 style={{marginTop: '20px'}}>Restricted Access</h3>
                    <p style={{fontSize: '18px', color: '#777'}}>
                        The information on this page is available only to logged-in users. Please log in to access the
                        data.
                    </p>
                    <LinkContainer exact to="/login">
                        <Button bsStyle={'primary'}>Go to Login</Button>
                    </LinkContainer>
                </div>
            )}
            {users  && (
                <Row className="vertical-middle breadcrumbs">
                    <Col xs={8}>
                        <h5>
                            <Glyphicon glyph="cog"/> Page > Users
                        </h5>
                    </Col>
                    <Col xs={4} className="text-right">
                        <h4>
                            <LinkContainer exact to={`/user`}>
                                <Button bsStyle={'success'}>
                                    <Glyphicon glyph="plus"/> Add
                                </Button>
                            </LinkContainer>
                        </h4>
                    </Col>
                </Row>
            )}
            {users && (
                <BootstrapTable
                    data={users}
                    fetchInfo={{ dataTotalSize: users.length }}
                    striped
                    hover
                    remote
                    pagination
                    bordered={false}
                    options={{
                        onPageChange: (newPage, newSizePerPage) => {
                            setPage(newPage);
                            setSizePerPage(newSizePerPage);
                        },
                        onSizePerPageList: (newSizePerPage) => {
                            setSizePerPage(newSizePerPage);
                        },
                        page,
                        sizePerPage
                    }}
                >
                    <TableHeaderColumn width="15" isKey dataField='id'>ID</TableHeaderColumn>
                    <TableHeaderColumn width="40" dataField='email'>Name</TableHeaderColumn>
                    <TableHeaderColumn width="25" dataField='id' dataFormat={(cell, row) => {
                        return (
                            <div>
                                <LinkContainer exact to={`/user/${row.id}`}>
                                    <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip">Edit</Tooltip>}>
                            <span className="text-success pointer">
                              <i className="fas fa-edit" />
                            </span>
                                    </OverlayTrigger>
                                </LinkContainer>
                                <span> </span>
                                <LinkContainer to={`/users`} onClick={() => deleteUser(row.id)}>
                                    <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip">Delete</Tooltip>}>
                                <span className="text-danger pointer" onClick={() => deleteUser(row.id)}>
                                  <i className="fas fa-trash-alt" />
                                </span>
                                    </OverlayTrigger>
                                </LinkContainer>
                            </div>
                        );
                    }}>Actions
                    </TableHeaderColumn>
                </BootstrapTable>
            )}
        </div>
    );
};

const mapStateToProps = (state) => ({
    currentUser: state.user
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Users);
