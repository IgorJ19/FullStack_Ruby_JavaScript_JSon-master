import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, ControlLabel, Form, FormControl, FormGroup, Glyphicon, Row } from 'react-bootstrap';
import * as actions from './CertificatesApi';
import { Redirect, withRouter } from "react-router";
import {LinkContainer} from "react-router-bootstrap";

//komponent funkcyjny zastępujący klasę
const Certificate = ({ actions, match, history }) => {

    //służy do zmiany wartości poniżej opisanych elementów useState: Jest to hook, który deklaruje stan w komponencie funkcyjnym, coś jak konstruktor
    const [resource, setResource] = useState({
        name: '',
        description: '',
        user_name: ''
    });

    //obiek który przechowuje błędy walidacji oraz metoda do edcji błędów
    const [validationErrors, setValidationErrors] = useState({});
    //podobnie jak powyżej, używamy do edycji nazw
    const [previousCertificateName, setPreviousCertificateName] = useState('');
    //tablica użytkowników i metoda do edycji
    const [users, setUsers] = useState(null);
    //boolean, odpowiedź na pytanie czy należy przenieśc na innąą stronę
    const [redirect, setRedirect] = useState(false);
    const [showAccessMessage, setShowAccessMessage] = useState(false);

    // Pobieranie ID z parametrów URL
    const { id } = match.params;

    //ładowanie listy certyfikatów i obsługa
    useEffect(() => {
        actions.loadUsers()
            .then(users => setUsers(users))
            .catch(error => console.error('Error fetching users:', error));

    //jeśli dane id istnieje wykonujemy polecenie załadowania certyfikatu o konkretnym id
        if (id) {
            actions.loadCertificate(id, resource => {
                setResource(resource);
                //ustawiamy nazwe dla obecnego (a w przyszłości poprzedniego) certyfikatu
                setPreviousCertificateName(resource.name);
            });
        }

        const timer = setTimeout(() => {
            setShowAccessMessage(true);
        }, 300);

        return () => clearTimeout(timer); // Czyszczenie timera przy odmontowaniu
    }, [actions, id]);

    //wszystkie wykonjują się wraz ze zmianą wartości w polach formularza
    const handleNameChange = (e) => setResource({ ...resource, name: e.target.value });
    const handleDescriptionChange = (e) => setResource({ ...resource, description: e.target.value } , console.log(resource.description));
    const handleUserNameChange = (e) => setResource({ ...resource, user_name: e.target.value });

    // zapis z danymi wprowadzonymi do formularza oraz walidacja danych
    const saveCertificate = (e) => {
        e.preventDefault();
        const errors = {};
        if (!resource.name) errors.name = "Name can't be null";
        if (!resource.description) errors.description = "Description can't be null";
        if (!resource.user_name) errors.user_name = "You need to choose the user email";

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
        } else {
            actions.saveCertificate(resource, () => setRedirect(true));
        }
    };

    if (redirect) {
        return <Redirect to="/certificates" />;
    }

    const getValidationState = (field) => (validationErrors[field] ? 'error' : null);

    return (
        <div>
            {!users && showAccessMessage &&  (
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
            {users && (
            <Row className="vertical-middle breadcrumbs">
                <Col xs={8}>
                    <h5>
                        <Glyphicon glyph="cog" /> Page > Certificates {resource.id ?
                        <span><b>{previousCertificateName}</b> - edit</span> :
                        <span>New</span>}
                    </h5>
                </Col>
            </Row>
            )}

            {users && (

            <Row id='form'>
                <Col xs={12} md={6}>
                    {/*wskazanie do metody zapisu */}
                    <Form horizontal onSubmit={saveCertificate}>
                        <FormGroup controlId="name" validationState={getValidationState('name')}>
                            <Col componentClass={ControlLabel} sm={2}>Name</Col>
                            <Col sm={10}>
                                <FormControl
                                    className="form-control"
                                    style={{ width: '400px' }}
                                    value={resource.name}
                                    placeholder="Enter text"
                                    onChange={handleNameChange}
                                />
                                {validationErrors.name && (
                                    <ControlLabel>{validationErrors.name}</ControlLabel>
                                )}
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="description" validationState={getValidationState('description')}>
                            <Col componentClass={ControlLabel} sm={2}>Description</Col>
                            <Col sm={10}>
                                <textarea
                                    // opis wyglądu kontrolki oraz wartość jaką docelowo będzie zawierać i metoda wykonywana przy zmianie wartości w niej
                                    className="form-control"
                                    style={{ maxHeight: '200px', maxWidth: '400px', minHeight: '100px', minWidth: '200px', resize: 'true' }}
                                    value={resource.description}
                                    placeholder="Enter text"
                                    onChange={handleDescriptionChange}
                                />
                                {validationErrors.description && (
                                    <ControlLabel>{validationErrors.description}</ControlLabel>
                                )}
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="user_name" validationState={getValidationState('user_name')}>
                            <Col componentClass={ControlLabel} sm={2}>Select User</Col>
                            <Col sm={10}>
                                <FormControl componentClass="select"
                                             placeholder="select"
                                             value={resource.user_name}
                                             onChange={handleUserNameChange}>
                                    <option value="">Select User</option>
                                    {/*pobieranie userów do slecta
                                        kluczem jest id, każda opcja więc jest po nim rozróżniana
                                         danemu certyfikatowi przypiszemy wybrany przez nas email z listy pobranych email*/}
                                    {users.map(user => (
                                        <option key={user.id} value={user.email}>{user.email}</option>
                                    ))}
                                </FormControl>
                                {validationErrors.user_name && (
                                    <ControlLabel>{validationErrors.user_name}</ControlLabel>
                                )}
                            </Col>
                        </FormGroup>
                        <Col xsOffset={2} xs={10} className='form-buttons margin10'>
                            <Button type="submit" bsStyle={'success'}>Save</Button>
                            <Button bsStyle={'warning'} onClick={() => history.push('/certificates')}>
                                Cancel
                            </Button>
                        </Col>
                    </Form>
                </Col>
            </Row>
            )}
        </div>
    );
};

Certificate.propTypes = {
    actions: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

export default withRouter(connect(null, mapDispatchToProps)(Certificate));
