import React, { Component } from "react";
import Nav from "../../components/nav/Nav";
import Api from "../../components/Api";
import {Redirect} from 'react-router';
import FontAwesome from 'react-fontawesome'
import ip from "ip";
import styles from "./styles/Index.module.scss";

class Index extends Component {

  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      redirectRoomId: '',
      loading: false
    }
  }

  createRoom() {
    let createRoomRequest = {
      name: 'Fresh Room2', 
      description: 'Fresh New Room',
      sourceIp: ip.address()
    };
    Api.createRoom(createRoomRequest)
      .then(roomResponse => {
        console.log(roomResponse);
        this.setState({loading: true});
        setTimeout(function() {
          this.setState({redirect: true, redirectRoomId: roomResponse._id});
        }.bind(this), 2000);
      })
    .catch(err => console.error)
  }

  

  render() {
    let displayDiv =  (<div className={styles.loginButton}>
                        <a type="button" className="btn btn-dark" href="/login/discord"><i className="fab fa-discord fa-2x"/> <p>Login</p> </a>
                    </div>);
    
    if (this.state.redirect) {
       console.log("attempting redirect");
       return <Redirect to={'/rooms/' + this.state.redirectRoomId} />;
    }
    return (
      <div>
        <Nav isHome={true} loading={this.state.loading}/>
        <div className="container-fluid home">
          <section className={styles.ctaSection}>
            <img src="/img/cloud_1.svg" className={styles.cloud1}/>
            <img src="/img/cloud_2.svg" className={styles.cloud2}/>
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
                  { displayDiv }
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

    )
  }
}

export default Index;
