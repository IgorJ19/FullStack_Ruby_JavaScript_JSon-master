import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, ControlLabel, Form, FormControl, FormGroup, Glyphicon, Row } from "react-bootstrap";
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import * as actions from "./UsersApi";
import {LinkContainer} from "react-router-bootstrap";

const User = ({ match, history, loadUser, loadUsers, saveUser }) => {
    const [resource, setResource] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [previousUserName, setPreviousUserName] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [showAccessMessage, setShowAccessMessage] = useState(false);

    useEffect(() => {

        const id = match.params.id;
        if (id) {
            loadUser(id, (data) => {
                setResource(data);
                setPreviousUserName(data.email);
            });
        } else {
            if(actions.logInFlag) {
                setResource({});
            }
            else setResource(null);
        }

        const timer = setTimeout(() => {
            setShowAccessMessage(true);
        }, 300);

        return () => clearTimeout(timer); // Czyszczenie timera przy odmontowaniu

    }, [match.params.id]);


    const handleNameChange = (e) => {
        setResource({ ...resource, email: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setResource({ ...resource, password: e.target.value });
    };

    const handlePasswordConfirmChange = (e) => {
        setPasswordConfirm(e.target.value);
    };

    const saveUserData = (e) => {
        e.preventDefault();
        const errors = {};
        if (!resource.email || resource.email.length < 5) {
            errors.email = "Invalid email";
        }
        if (!resource.password || resource.password.length < 6) {
            errors.password = "Invalid password";
        }
        if (passwordConfirm !== resource.password) {
            errors.passwordConfirm = "Passwords don't match";
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
        } else {
            saveUser(resource, () => {
                history.push('/users');
            });
        }
    };

    const getValidationState = (field) => {
        return validationErrors[field] ? 'error' : null;
    };

    return (
        <div>
            {!resource && showAccessMessage && (
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

            {resource && (
                <Row className="vertical-middle breadcrumbs">
                    <Col xs={8}>
                        <h5>
                            <Glyphicon glyph="cog" /> Admin > Users > {resource.id ?
                            <span><b>{previousUserName}</b> - edit</span> :
                            <span>New</span>}
                        </h5>
                    </Col>
                </Row>
            )}
            {resource && (
                <Row id='form'>
                    <Col xs={12} md={6}>
                        <Form horizontal onSubmit={saveUserData}>
                            <FormGroup
                                controlId="email"
                                validationState={getValidationState('email')}
                            >
                                <Col componentClass={ControlLabel} sm={2}>Email</Col>
                                <Col sm={10}>
                                    <FormControl
                                        type="email"
                                        value={resource.email || ''}
                                        placeholder="Enter text"
                                        onChange={handleNameChange}
                                    />
                                    {validationErrors.email && <ControlLabel>{validationErrors.email}</ControlLabel>}
                                </Col>
                                <FormControl.Feedback />
                            </FormGroup>
                            <FormGroup
                                controlId="password"
                                validationState={getValidationState('password')}
                            >
                                <Col componentClass={ControlLabel} sm={2}>Password</Col>
                                <Col sm={10}>
                                    <FormControl
                                        type="password"
                                        value={resource.password || ''}
                                        placeholder="Enter text"
                                        onChange={handlePasswordChange}
                                    />
                                    {validationErrors.password && <ControlLabel>{validationErrors.password}</ControlLabel>}
                                </Col>
                                <FormControl.Feedback />
                            </FormGroup>
                            <FormGroup
                                controlId="confirmPassword"
                                validationState={getValidationState('confirmPassword')}
                            >
                                <Col componentClass={ControlLabel} sm={2}>Confirm password</Col>
                                <Col sm={10}>
                                    <FormControl
                                        type="password"
                                        value={passwordConfirm}
                                        placeholder="Enter text"
                                        onChange={handlePasswordConfirmChange}
                                    />
                                    {validationErrors.passwordConfirm && <ControlLabel>{validationErrors.passwordConfirm}</ControlLabel>}
                                </Col>
                                <FormControl.Feedback />
                            </FormGroup>
                            <Col xsOffset={2} xs={10} className='form-buttons margin10'>
                                <Button type="submit" bsStyle={'success'}>Save</Button>
                                <Button
                                    bsStyle={'warning'}
                                    onClick={() => history.push(`/users`)}
                                >
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

User.propTypes = {
    loadUser: PropTypes.func.isRequired,
    saveUser: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired
};

const mapDispatchToProps = dispatch => ({
    loadUser: (id, callback) => dispatch(actions.loadUser(id, callback)),
    saveUser: (resource, callback) => dispatch(actions.saveUser(resource, callback))
});

export default connect(
    null,
    mapDispatchToProps
)(withRouter(User));
