import React, { Component } from "react";
import Nav from "../../components/nav/Nav";
import styles from "./styles/Index.module.scss";
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      redirectRoomId: '',
      loading: false
    }
  }


  render() {
    return (
      <div>
        <Nav />
        <div className="container-fluid home">
          <section className={styles.ctaSection}>
            {/* { cloudDivs } */}
            <img alt="cloud" src="/img/cloud_1.svg" className={styles.cloud1}/>
            <img alt="cloud" src="/img/cloud_2.svg" className={styles.cloud2}/>
            <div className={"row justify-content-md-center " + styles.ctaContent }>
              <div className="col-3">
                <div className="row">
                  <h1 className={styles.brandName}> miraqi </h1>
                </div>
              </div>
              <div className={"col-4 " + styles.banner} >
                <div className="row">
                  <h2 className={styles.logoDescription}> Your personalized discord media share room </h2>
                </div>
                <div className="row">
                  <p className={styles.logoFineDescription}> Share media with your entire discord server. No bot required. </p>
                </div>
                <div className="row">
                    <div className={styles.loginButton}>
                        <Link to="/login/discord">
                          <i className="fab fa-discord fa-2x"/> 
                          <p>Login</p> 
                        </Link>
                    </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

    )
  }
}

export default withRouter(connect()(Home));
