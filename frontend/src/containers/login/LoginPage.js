import React, { useState } from 'react';
import { Button, ControlLabel, FormControl, FormGroup, Grid } from "react-bootstrap";
import './LoginPage.scss';
import { bindActionCreators } from "redux";
import * as actions from "./LoginPageActions";
import { connect } from "react-redux";

const LoginPage = ({ actions }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onEmailChange = e => setEmail(e.target.value);
    const onPasswordChange = e => setPassword(e.target.value);
    const onSubmit = e => {
        e.preventDefault();
        actions.login(email, password);
    };

    return (
        <div>
            <Grid>
                <form className="form-signin" onSubmit={onSubmit}>
                    <h2 className="form-signin-heading">Please sign in</h2>
                    <FormGroup controlId="email">
                        <ControlLabel>Email</ControlLabel>
                        <FormControl
                            type="text"
                            value={email}
                            onChange={onEmailChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="password">
                        <ControlLabel>Password</ControlLabel>
                        <FormControl
                            type="password"
                            value={password}
                            onChange={onPasswordChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Button bsStyle="primary" type="submit" block bsSize="large">
                            Sign in
                        </Button>
                    </FormGroup>
                </form>
            </Grid>
        </div>
    );
};

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(
    null,
    mapDispatchToProps
)(LoginPage);
