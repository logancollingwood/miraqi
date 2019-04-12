import React, { Component } from "react";
import {connect} from 'react-redux';
import {Row} from "react-bootstrap";
import { withRouter } from "react-router";
import styles from "../index/styles/Index.module.scss";
import Nav from "../../components/nav/Nav";
import AccountForm from "./AccountForm";
import SocketApp from "../../SocketApp";

const initialState = { user: null };

const mapStateToProps = (state = {}) => {
    return {};
};

class AccountCreation extends Component {
    state = initialState;
    render() {
        return (
            <SocketApp>
                <Nav/>
                <div className="container-fluid home">
                    <section className={styles.ctaSection}>
                        <img alt="cloud1" src="/img/cloud_1.svg" className={styles.cloud1}/>
                        <img alt="cloud2" src="/img/cloud_2.svg" className={styles.cloud2}/>
                        <Row>
                            <div className={"col-6 offset-4 " + styles.banner} >
                                <div className="row">
                                <AccountForm />
                                </div>
                            </div>
                        </Row>
                    </section>
                </div>
            </SocketApp>
        )
    }
}

export default withRouter(connect(mapStateToProps)(AccountCreation));