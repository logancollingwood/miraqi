import React, { Component } from "react";
import {connect} from 'react-redux';
import loginStyles from "./styles/Account.module.scss";
import {
    HelpBlock,
    FormGroup,
    FormControl,
    ControlLabel,
    Row
} from "react-bootstrap";
import API from "../../components/Api"

const initialState = { email: "", password: "", error_message: null, error_code: null};
type State = Readonly<typeof initialState>;

const mapStateToProps = (state = {}) => {
    return {};
};

class AccountForm extends Component<object, State> {
    readonly state: State = initialState;
    loginButtonId: String = 'login';
    registerButtonId: String = 'login';
    apiClient: API = new API();

    emailChanged = (e :React.FormEvent<HTMLInputElement>) => {
        this.setState({email : e.currentTarget.value});
    }

    passwordChanged = (e :React.FormEvent<HTMLInputElement>) => {
        this.setState({password : e.currentTarget.value});
    }

    login = async () => {
        const valid: boolean = this.validateInputs();
        console.log(`valid: ${valid}`);
        console.log(`login : ${this.state.email} + ${this.state.password}`);

    }

    register = async () => {
        console.log("register : " + this.state);   
        if (this.validateInputs()) {
            try {
                const accountCreateResponse = await this.apiClient.createAccount({
                    email: this.state.email,
                    password: this.state.password
                });
            } catch (err) {
                this.setState({
                    error_message: err.message,
                    error_code: err.code
                })
            }
        }

    }


    validateInputs = () => {
        if (!this.state.email || !this.state.password) {
            return false;
        }
        return true;
    }

    render() {
        return (
            <div>
                <div className={"card " + loginStyles.card}>
                    <Row>
                        <p className={loginStyles.loginBanner}> Login or Register </p>
                    </Row>
                    {
                        (this.state.error_message || this.state.error_code) && 
                        <Row>
                            <p className={loginStyles.errorMessage} > Uh-oh, we weren't able to create your account at this time: {this.state.error_message}, ${this.state.error_code}</p>
                        </Row>
                    }
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className={"input-group-text " + loginStyles.label} id="email-label">email</span>
                        </div>
                        <input type="email" className="form-control" aria-label="email" aria-describedby="email" onChange={ this.emailChanged }/>
                    </div>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span id="password-label" className={"input-group-text " + loginStyles.label}>password</span>
                        </div>
                        <input type="password" className="form-control" placeholder="" aria-label="password" aria-describedby="password" onChange={ this.passwordChanged }/>
                    </div>
                    <Row>
                        <div className="col-md-6">
                            <button onClick={this.login} type="button" className={"btn btn-primary " + loginStyles.loginButton}>Login</button>
                        </div>
                        <div className="col-md-6">
                            <button onClick={this.register} type="button" className={"btn btn-success " + loginStyles.registerButton}>Register</button>
                        </div>
                    </Row>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(AccountForm);