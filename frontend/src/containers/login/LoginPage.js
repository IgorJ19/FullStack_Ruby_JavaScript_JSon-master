import React, {Component} from 'react';
import {Button, ControlLabel, FormControl, FormGroup, Grid} from "react-bootstrap";
import './LoginPage.scss'
import {bindActionCreators} from "redux";
import * as actions from "./LoginPageActions";
import connect from "react-redux/es/connect/connect";

class LoginPage extends Component {
    state = {email: '', password: ''};

    onEmailChange = e => {
        this.setState({email: e.target.value});
    };
    onPasswordChange = e => {
        this.setState({password: e.target.value});
    };
    onSubmit = e => {
        e.preventDefault();
        this.props.actions.login(this.state.email, this.state.password);
    };


    render() {
        const {email, password} = this.state;

        return (
            <div>
                <Grid>
                    <form className="form-signin" onSubmit={this.onSubmit}>
                        <h2 className="form-signin-heading">Please sign in</h2>
                        <FormGroup controlId="email">
                            <ControlLabel>Email</ControlLabel>
                            <FormControl
                                type="text"
                                value={email}
                                onChange={this.onEmailChange}
                            />
                        </FormGroup>
                        <FormGroup controlId="password">
                            <ControlLabel>Password</ControlLabel>
                            <FormControl
                                type="password"
                                value={password}
                                onChange={this.onPasswordChange}
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
    }
}

LoginPage.propTypes = {};

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        actions,
        dispatch)
});

export default connect(
    undefined,
    mapDispatchToProps
)(LoginPage)
