import React, { Component } from "react";
import {connect} from 'react-redux';
import styles from "../index/styles/Index.module.scss";
import Nav from "../../components/nav/Nav";

const initialState = { accountId: null };
type State = Readonly<typeof initialState>;

const mapStateToProps = (state = {}) => {
    return {};
};

class Room extends Component<object, State> {
    readonly state: State = initialState;
    render() {
        return (
            <div>
                <Nav isHome={false} isRoom={true}/>
                <div className="container-fluid home">
                    <section className={styles.ctaSection}>
                        <img src="/img/cloud_1.svg" className={styles.cloud1}/>
                        <img src="/img/cloud_2.svg" className={styles.cloud2}/>
                        <div className={"row justify-content-md-center " + styles.ctaContent }>
                        <div className="col-6">
                            <div className="row">
                            <h1 className={styles.brandName}> Account Creation </h1>
                            </div>
                        </div>
                        <div className={"col-4 " + styles.banner} >
                            <div className="row">
                               
                            </div>
                        </div>
                        </div>
                    </section>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(Room);