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
    let displayDiv =  (<div>
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
          <section className={styles.cta}>
            <div className="row justify-content-md-center">
              <div className="col-3">
                <img className={styles.logoImg} src="/img/miraqi_vector.png" />
              </div>
              <div className={"col-6 offset-3 offset-md-1 " + styles.banner} >
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
            <div className="arrow-container"><div className="arrow bounce"></div></div>
          </section>
          <section className={styles.feature1}>
            <div className="row">
              <div className="col-6 offset-1">
                <h1 className="banner"> share music </h1>
                <p className="flavorText"> Sign in with your discord account, connect to your server's room, and queue up and share songs.</p>
                <p className="flavorText"> No need for a hosted music bot. Plus, share visual media and keep track of your group's favorite content.</p>
              </div>
            </div>
          </section>
          <section className="command-section">
            <div className="row justify-content-md-center">
              <div className="col-6 offset-3">
                <div className="commmand">
                 <p className="commandName"> !play </p>
                 <p className="commandExample"> <a href="https://youtu.be/pb8vWUDEmxc"> https://youtu.be/pb8vWUDEmxc </a></p>  
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
