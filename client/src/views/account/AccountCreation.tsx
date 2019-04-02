import React, { Component } from "react";
import {connect} from 'react-redux';
import {Row} from "react-bootstrap";

import styles from "../index/styles/Index.module.scss";
import loginStyles from "./styles/Account.module.scss";
import Nav from "../../components/nav/Nav";
import AccountForm from "./AccountForm";

const initialState = { user: null };
type State = Readonly<typeof initialState>;

const mapStateToProps = (state = {}) => {
    return {};
};

class AccountCreation extends Component<object, State> {
    readonly state: State = initialState;
    render() {
        return (
            <div>
                <Nav isHome={false} isRoom={true}/>
                <div className="container-fluid home">
                    <section className={styles.ctaSection}>
                        <img src="/img/cloud_1.svg" className={styles.cloud1}/>
                        <img src="/img/cloud_2.svg" className={styles.cloud2}/>
                        <Row>
                            <div className={"col-6 offset-4 " + styles.banner} >
                                <div className="row">
                                <AccountForm />
                                </div>
                            </div>
                        </Row>
                    </section>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(AccountCreation);