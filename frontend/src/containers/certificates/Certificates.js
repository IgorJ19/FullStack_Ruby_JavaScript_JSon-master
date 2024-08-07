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
    const [showAccessMessage, setShowAccessMessage] = useState(false);



    useEffect(() => {
        loadCertificates({ page, per_page: sizePerPage }, setCertificates);

        const timer = setTimeout(() => {
            setShowAccessMessage(true);
        }, 300);

        return () => clearTimeout(timer); // Czyszczenie timera przy odmontowaniu
    }, [loadCertificates, page, sizePerPage]);


    const handleDelete = (id) => {
        deleteCertificate(id);
        loadCertificates({ page, per_page: sizePerPage }, setCertificates);
    };



        return (
        <div>
            {!certificates && showAccessMessage && (
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
            {certificates &&  (
            <Row className="vertical-middle breadcrumbs">
                <Col xs={8}>
                    <h5>
                        <Glyphicon glyph="cog" /> Page > Certificates
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
            )}
            {certificates && (
                <BootstrapTable
                    data={certificates}
                    fetchInfo={{ dataTotalSize: certificates.length }}
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
            )}

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

