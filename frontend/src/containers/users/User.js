import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Button, Col, ControlLabel, Form, FormControl, FormGroup, Glyphicon, Row} from "react-bootstrap";
import * as actions from "./UsersApi";
class User extends Component {

    handleNameChange = (e) => {
        const { resource} = this.state;
        const newEmail = e.target.value;
        this.setState({ resource: { ...resource, email: newEmail } });
    };
    handlePasswordChange = (e) => {
        const {resource} = this.state;
        this.setState({resource: {...resource, password: e.target.value}});
    };
    handlePasswordConfirmChange = (e) => {
        this.setState({passwordConfirm: e.target.value});
    };
    saveUser = (e) => {
        e.preventDefault();
        const {resource, passwordConfirm} = this.state;
        const validationErrors = {};
        if (Object.keys(resource).length > 0) {
            if (!resource.email || resource.email.length < 5)
                validationErrors.email = "invalid email";
            if (!resource.password || resource.password.length < 6)
                validationErrors.password = "invalid password";
            if (passwordConfirm !== resource.password)
                validationErrors.passwordConfirm = "passwords don't match";
        }
        if (Object.keys(validationErrors).length > 0) {
            this.setState({validationErrors});
        } else {
            this.props.actions.saveUser(resource, () => {
                this.context.router.history.push('/users');
            });
        }
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            resource: {},
            validationErrors: {},
            previousUserName: '',
            passwordConfirm: ''
        }
    };

    componentDidMount() {
        const id = this.props.match.params.id;
        if (id != null) {
            this.loadUser(id, organizer => this.setState({resource: organizer}));
        } else {
            this.setState({resource: {}});
        }
    };

    loadUser(id) {
        this.props.actions.loadUser(id,
            resource => this.setState({resource: resource, previousUserName: resource.email}));
    };

    getValidationState(id) {
        const {validationErrors} = this.state;
        if (validationErrors.email && id === 'email') {
            return 'error';
        }
        if (validationErrors.password && id === 'password') {
            return 'error';
        }
        if (validationErrors.passwordConfirm && id === 'confirmPassword') {
            return 'error';
        }
        return null;
    }

    render() {
        const {resource, validationErrors, previousUserName, passwordConfirm} = this.state;
        return (
            <div>
                {resource && <Row className="vertical-middle breadcrumbs">
                    <Col xs={8}>
                        <h5>
                            <Glyphicon
                                glyph="cog"/> Admin > Users > {resource.id ?
                                <span><b>{previousUserName}</b> - edit</span> :
                                <span>New</span>}
                        </h5>
                    </Col>
                </Row>
                }
                {resource &&
                <Row id='form'>
                    <Col xs={12} md={6}>
                        <Form horizontal onSubmit={this.saveUser}>
                            <FormGroup
                                controlId="email"
                                validationState={this.getValidationState('email')}
                            >
                                <Col componentClass={ControlLabel} sm={2}>Email</Col>
                                <Col sm={10}>
                                    <FormControl
                                        type="email"
                                        defaultValue={resource.id ? previousUserName : ' '}
                                        value={resource.email}
                                        placeholder="Enter text"
                                        onChange={this.handleNameChange}
                                    />
                                    {
                                        Object.keys(validationErrors).length > 0 && validationErrors.email &&
                                        <ControlLabel>{validationErrors.email}</ControlLabel>
                                    }
                                </Col>
                                <FormControl.Feedback/>
                            </FormGroup>
                            <FormGroup
                                controlId="password"
                                validationState={this.getValidationState('password')}
                            >
                                <Col componentClass={ControlLabel} sm={2}>Password</Col>
                                <Col sm={10}>
                                    <FormControl
                                        type="password"
                                        value={resource.password}
                                        placeholder="Enter text"
                                        onChange={this.handlePasswordChange}
                                    />
                                    {
                                        Object.keys(validationErrors).length > 0 && validationErrors.password &&
                                        <ControlLabel>{validationErrors.password}</ControlLabel>
                                    }
                                </Col>
                                <FormControl.Feedback/>
                            </FormGroup>
                            <FormGroup
                                controlId="confirmPassword"
                                validationState={this.getValidationState('confirmPassword')}
                            >
                                <Col componentClass={ControlLabel}
                                     sm={2}>Confirm password</Col>
                                <Col sm={10}>
                                    <FormControl
                                        type="password"
                                        value={passwordConfirm}
                                        placeholder="Enter text"
                                        onChange={this.handlePasswordConfirmChange}
                                    />
                                    {
                                        Object.keys(validationErrors).length > 0 && validationErrors.passwordConfirm &&
                                        <ControlLabel>{validationErrors.passwordConfirm}</ControlLabel>
                                    }
                                </Col>
                                <FormControl.Feedback/>
                            </FormGroup>
                            <Col xsOffset={2} xs={10} className='form-buttons margin10'>
                                <Button type="submit" bsStyle={'success'}>Save</Button>
                                <Button
                                    bsStyle={'warning'}
                                    onClick={() => this.context.router.history.push(`/users`)}
                                >
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

User.contextTypes = {
    router: PropTypes.object
};


const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        actions,
        dispatch)
});

export default connect(
    undefined,
    mapDispatchToProps
)(User)
