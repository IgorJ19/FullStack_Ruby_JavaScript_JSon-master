import React from 'react';
import { connect } from 'react-redux';
import { Nav, MenuItem, Glyphicon, Modal, Button } from 'react-bootstrap';
import { openModal, closeModal } from './modalActions';

const TermsModal = ({ isModalOpen, openModal, closeModal }) => {
    const handleOpenModal = () => {
        openModal();
    };

    const handleCloseModal = () => {
        closeModal();
    };


    return (
        <React.Fragment>
            <Nav pullLeft className="vmiddle">
                <MenuItem onClick={handleOpenModal}>
                    <Glyphicon glyph="book" /> Terms
                </MenuItem>
            </Nav>

            <Modal show={isModalOpen} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Terms and Conditions</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bardzo dobry modalny regulamin w modalu regulaminowym.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

const mapStateToProps = (state) => ({
    isModalOpen: state.modal.isModalOpen
});

const mapDispatchToProps = {
    openModal,
    closeModal
};

export default connect(mapStateToProps, mapDispatchToProps)(TermsModal);