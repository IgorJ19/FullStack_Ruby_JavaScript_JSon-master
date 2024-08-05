import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button, Col, Glyphicon, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { loadCertificates, deleteCertificate } from './CertificatesApi';

const Certificates = ({ loadCertificates, deleteCertificate}) => {
    const [certificates, setCertificates] = useState(null);
    const [page, setPage] = useState(1);
    const [sizePerPage, setSizePerPage] = useState(10);



    useEffect(() => {
        loadCertificates({ page, per_page: sizePerPage }, setCertificates);
    }, [loadCertificates, page, sizePerPage]);


    const handleDelete = (id) => {
        deleteCertificate(id);
        loadCertificates({ page, per_page: sizePerPage }, setCertificates);
    };



        return (
        <div>
            <Row className="vertical-middle breadcrumbs">
                <Col xs={8}>
                    <h5>
                        <Glyphicon glyph="cog" /> Admin &gt; Certificates
                    </h5>
                </Col>
                <Col xs={4} className="text-right">
                    <h4>
                        <LinkContainer exact to={`/certificate`}>
                            <Button bsStyle={'success'}>
                                <Glyphicon glyph="plus" /> Add
                            </Button>
                        </LinkContainer>
                    </h4>
                </Col>
            </Row>

                <BootstrapTable
                    data={certificates}
                    fetchInfo={10}
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
                    <TableHeaderColumn width="0" isKey dataField='id'></TableHeaderColumn>
                    <TableHeaderColumn width="20" dataField='name'>Name</TableHeaderColumn>
                    <TableHeaderColumn width="20" dataField='description'>Description</TableHeaderColumn>
                    <TableHeaderColumn width="15" dataField='user_name'>User Name</TableHeaderColumn>
                    <TableHeaderColumn
                        width="10"
                        dataField='id'
                        dataFormat={(cell, row) => (
                            <div>
                                <LinkContainer exact to={`/certificate/${row.id}`}>
                                    <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip">Edit</Tooltip>}>
                    <span className="text-success pointer">
                      <i className="fas fa-edit" />
                    </span>
                                    </OverlayTrigger>
                                </LinkContainer>
                                <span> </span>
                                <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip">Delete</Tooltip>}>
                  <span
                      className="text-danger pointer"
                      onClick={() => handleDelete(row.id)}
                  >
                    <i className="fas fa-trash-alt" />
                  </span>
                                </OverlayTrigger>
                            </div>
                        )}
                    >
                        Actions
                    </TableHeaderColumn>
                </BootstrapTable>

        </div>
    );
};

const mapStateToProps = (state) => ({
    certificates: state.certificates,
});

const mapDispatchToProps = {
    loadCertificates,
    deleteCertificate
};

export default connect(mapStateToProps, mapDispatchToProps)(Certificates);

