import React, { Component} from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, ControlLabel, Form, FormControl, FormGroup, Glyphicon, Row } from "react-bootstrap";
import * as actions from "./CertificatesApi";

class Certificate extends Component {

    state = {
        resource: {},
        validationErrors: {},
        previousCertificateName: '',
        users: [],
    };

    handleNameChange = (e) => {
        const { resource } = this.state;
        this.setState({ resource: { ...resource, name: e.target.value }});
    };

    handleDescriptionChange = (e) => {
        const { resource } = this.state;
        this.setState({ resource: { ...resource, description: e.target.value }});
    };

    handleUserNameChange = (e) => {
        const { resource } = this.state;
        this.setState({ resource: { ...resource, user_name: e.target.value }});
    };

    saveCertificate = (e) => {
        e.preventDefault();
        const { resource } = this.state;
        const validationErrors = {};
        if (Object.keys(resource).length > 0) {
            if (!resource.name || resource.name.length < 1)
                validationErrors.name = "name can't be null";
            if (!resource.description || resource.description.length < 1)
                validationErrors.description = "description can't be null";
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
        if (id != null) {
            this.loadCertificate(id, organizer => this.setState({ resource: organizer }));
        } else {
            this.setState({ resource: {} });
        }
    };

    loadCertificate(id) {
        this.props.actions.loadCertificate(id,
            resource => this.setState({ resource: resource, previousCertificateName: resource.name }));
    };

    getValidationState(id) {
        const { validationErrors } = this.state;
        if (validationErrors.name && id === 'name') {
            return 'error';
        }
        if (validationErrors.description && id === 'description') {
            return 'error';
        }
        if (validationErrors.descriptionConfirm && id === 'confirmDescription') {
            return 'error';
        }
        return null;
    }

    //<Glyphicon glyph="cog"/> Admin > Users > Certificates {resource.id ?
    //                             <span><b>{previousCertificateName}</b> - edit</span> :
    //                             <span>New</span>}
    //instrukcja warunkowa, jeżeli wyszukujemy użytkownika po id(jednoznaczne z aktualizujemy), wyskakuje dodatkowy dopisek oraz jego email
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
                                            style={{ width: '400px'}}
                                            type="text"
                                            value={resource.name}
                                            placeholder="Enter text"
                                            onChange={this.handleNameChange}
                                        />
                                        {
                                            Object.keys(validationErrors).length > 0 && validationErrors.name &&
                                            <ControlLabel>{validationErrors.name}</ControlLabel> && <FormControl.Feedback/>
                                        }
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId="description" validationState={this.getValidationState('description')}>
                                    <Col componentClass={ControlLabel} sm={2}>Description</Col>
                                    <Col sm={10}>
                                        <textarea
                                            className="form-control"
                                            style={{ maxHeight: '200px', maxWidth: '400px', minHeight: '100px', minWidth: '200px', resize: 'true' }}
                                            value={resource.description}
                                            placeholder="Enter text"
                                            onChange={this.handleDescriptionChange}
                                        />
                                        {Object.keys(validationErrors).length > 0 && validationErrors.description &&
                                            <ControlLabel>{validationErrors.description}</ControlLabel> && <FormControl.Feedback/>}
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId="user_name" validationState={this.getValidationState('user_name')}>
                                    <Col componentClass={ControlLabel} sm={2}>Select User</Col>
                                    <Col sm={10}>

                                        <FormControl componentClass="select"
                                                     placeholder="select"
                                                     value={resource.user_name}
                                                     onChange={this.handleUserNameChange}>

                                            <option value="">Select User</option>
                                            {users.map(user => (
                                                <option key={user.id} value={user.email}>{user.email}</option>
                                            ))}

                                        </FormControl>

                                        {Object.keys(validationErrors).length > 0 && validationErrors.user_name &&
                                            <ControlLabel>{validationErrors.user_name}</ControlLabel> && <FormControl.Feedback/>}

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

//                                             <FormControl componentClass="select"
//                                                      placeholder="select"
//                                                      value={resource.user_name}
//                                                      onChange={this.handleUserNameChange}>
//
//                                             <option value="">Select User</option>
//                                             {users.map(user => (
//                                                 <option key={user.id} value={user.email}>{user.email}</option>
//                                             ))}
//
//                                         </FormControl>
//                                          zapis użytkownika "zaczyna się" od value(wybranie czym z bazy operujemy na naszym switchu) oraz onChange gdzie wywoływana jest metoda
//                                          która aktualizuje komponent resource, aktualizując jedynie wartość name na nową wartość wprowadzoną przez użytkownika.
//                                          Pobiera on aktualny stan resource z state (jest on równy null) i wprowadza wartość w "pole" name. Następnie po naciśnięciu przycisku save
//                                          wywoływana jest saveCertyficate a w niej po przejściu przez intstrukcje warunkowe. Jeśli walidacja zwraca jakiekolwiek błędy (czyli obiekt validationErrors zawiera jakieś klucze),
//                                          aktualizujemy stan komponentu validationErrors z tymi błędami, aby wyświetlić je użytkownikowi. W innym wypadku: this.context.router.history.push('/certificates'). Ta linijka kodu przenosi
//                                          użytkownika do innej strony po zapisaniu certyfikatu

Certificate.contextTypes = {
    router: PropTypes.object
};

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(undefined, mapDispatchToProps)(Certificate);



