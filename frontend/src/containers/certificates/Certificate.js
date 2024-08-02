import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, ControlLabel, Form, FormControl, FormGroup, Glyphicon, Row } from 'react-bootstrap';
import * as actions from './CertificatesApi';

class Certificate extends Component {
    state = {
        resource: {
            name: '', // Inicjalizacja wartości
            description: '',
            user_name: ''
        },
        validationErrors: {},
        previousCertificateName: '',
        users: []
    };

    handleNameChange = (e) => {
        const { resource } = this.state;
        this.setState({ resource: { ...resource, name: e.target.value } });
    };

    handleDescriptionChange = (e) => {
        const { resource } = this.state;
        this.setState({ resource: { ...resource, description: e.target.value } });
    };

    handleUserNameChange = (e) => {
        const { resource } = this.state;
        this.setState({ resource: { ...resource, user_name: e.target.value } });
    };

    saveCertificate = (e) => {
        e.preventDefault();
        const { resource } = this.state;
        const validationErrors = {};
        if (Object.keys(resource).length > 0) {
            if (!resource.name || resource.name.length < 1)
                validationErrors.name = "Name can't be null";
            if (!resource.description || resource.description.length < 1)
                validationErrors.description = "Description can't be null";
            if (!resource.user_name)
                validationErrors.user_name = "You need to choose the user email";
        }
        if (Object.keys(validationErrors).length > 0) {
            this.setState({ validationErrors });
        } else {
            this.props.actions.saveCertificate(resource, () => {
                this.context.router.history.push('/certificates');
            });
        }
    };

    componentDidMount() {
        this.props.actions.loadUsers()
            .then(users => this.setState({ users }))
            .catch(error => console.error('Error fetching users:', error));

        const id = this.props.match.params.id;
        if (id) {
            this.loadCertificate(id);
        }
    }

    loadCertificate(id) {
        this.props.actions.loadCertificate(id, resource =>
            this.setState({ resource: resource, previousCertificateName: resource.name })
        );
    }

    getValidationState(id) {
        const { validationErrors } = this.state;
        if (validationErrors[id]) {
            return 'error';
        }
        return null;
    }

    render() {
        const { resource, validationErrors, previousCertificateName, users } = this.state;
        return (
            <div>
                {resource && <Row className="vertical-middle breadcrumbs">
                    <Col xs={8}>
                        <h5>
                            <Glyphicon glyph="cog"/> Admin > Users > Certificates {resource.id ?
                            <span><b>{previousCertificateName}</b> - edit</span> :
                            <span>New</span>}
                        </h5>
                    </Col>
                </Row>}
                {resource &&
                    <Row id='form'>
                        <Col xs={12} md={6}>
                            <Form horizontal onSubmit={this.saveCertificate}>
                                <FormGroup controlId="name" validationState={this.getValidationState('name')}>
                                    <Col componentClass={ControlLabel} sm={2}>Name</Col>
                                    <Col sm={10}>
                                        <FormControl
                                            className="form-control"
                                            style={{ width: '400px'}}
                                            value={resource.name || ''}
                                            placeholder="Enter text"
                                            onChange={this.handleNameChange}
                                        />
                                        {validationErrors.name &&
                                            <ControlLabel>{validationErrors.name}</ControlLabel>}
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId="description" validationState={this.getValidationState('description')}>
                                    <Col componentClass={ControlLabel} sm={2}>Description</Col>
                                    <Col sm={10}>
                                        <textarea
                                            className="form-control"
                                            style={{ maxHeight: '200px', maxWidth: '400px', minHeight: '100px', minWidth: '200px', resize: 'true' }}
                                            value={resource.description || ''}
                                            placeholder="Enter text"
                                            onChange={this.handleDescriptionChange}
                                        />
                                        {validationErrors.description &&
                                            <ControlLabel>{validationErrors.description}</ControlLabel>}
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId="user_name" validationState={this.getValidationState('user_name')}>
                                    <Col componentClass={ControlLabel} sm={2}>Select User</Col>
                                    <Col sm={10}>
                                        <FormControl componentClass="select"
                                                     placeholder="select"
                                                     value={resource.user_name || ''}
                                                     onChange={this.handleUserNameChange}>
                                            <option value="">Select User</option>
                                            {users.map(user => (
                                                <option key={user.id} value={user.email}>{user.email}</option>
                                            ))}
                                        </FormControl>
                                        {validationErrors.user_name &&
                                            <ControlLabel>{validationErrors.user_name}</ControlLabel>}
                                    </Col>
                                </FormGroup>
                                <Col xsOffset={2} xs={10} className='form-buttons margin10'>
                                    <Button type="submit" bsStyle={'success'}>Save</Button>
                                    <Button bsStyle={'warning'} onClick={() => this.context.router.history.push(`/certificates`)}>
                                        Cancel
                                    </Button>
                                </Col>
                            </Form>
                        </Col>
                    </Row>
                }
            </div>
        );
    }
}

Certificate.contextTypes = {
    router: PropTypes.object
};

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(null, mapDispatchToProps)(Certificate);
