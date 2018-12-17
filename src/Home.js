import React, { Component } from "react";
import Nav from "./Nav";
import Api from "./components/Api";
import {Redirect} from 'react-router';
import FontAwesome from 'react-fontawesome'
import ip from "ip";

class Home extends Component {

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
          <section className="content banner">
            <div className="row justify-content-md-center">
              <div className="col-8 col-md-offset-2">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAMwSURBVGhD7ZlLqE1RGMc3ikiUNxmQ54DyGFAmKAYMZEAehRIlAwYkjJTyjBIy8SiPkJRigBghUmTmNfAo8oo8Qx6/326v6+DKOffss8/Ztf/16+7vO2evtb6791rr+9aJCjWv0bAaTsFteAM/4As8g2uwF+ZDV2godYRlcAccdLkY3EkYAXXXAngCYXDP4QDMBgfYG9pABxgA42AlXISv4D3fwYAGQ+bqBMchBHATpkNrKFfdYD28Bdt4B3MhMw2Fu2Dnr2EWtIKWyrmyH8I/ZQ/4FGuqvvAY7PA69Ie05Gv6AWx7t45aqTuECX0B2kHaGgshmA06aqHTYAdXwTlSK02Cz2BfU3WkqZlgw6+gp44ay+Xc/h6Ay3sq6gxhiV2oIwM52X3y9rlNRxpy3bfBy1DN6lSp3IfcYz5CDx3VyIE/BAOZoSNjuajY99rYqkLuxDb0FNrqyFhhbt6KrSq0DmxoV2xlL5f4T+AY+uhoqc6DjbhZ1Uth0lf1aj8CGxkeW/XRDnAMLZonJnRnwAbEGqIec8T6JmQTJpfLoSKdAG+2MHqfXG+CLGXqH/Yvi7JvybU7/3/lXAiZrYWPT2ZkYt+HLDUB7Neq0vJgVWJbx1iBDoFmtR38YsCnodzZS+2sZJ5lv4djK4rmQOn4LCHGwG+aB35o5rk4uW7UQExe9Xntq9cFYvkuuuH5gUvcnwNvtEC0zcXOJfYWiGV5qeNSbOUjEDUMtM3I4xX1aOJYpIHyEoiyStU3USOs09biKk+BhAVqhYanFxrtNVCeAgkF2FaNcL4Uao08BbIE9MVJ7YvECEeYeQpkDejzfCy6khjjNVCeAvFan2fJ8TqssVkD5SUQl9zwNg3UMSoxXoKDzksgHoRom4s1KaTsJmNu+aUDb8RA3Cocj/Y0aFI/8In4wY3kb6MGcg9CEG7mf8njl3BiIhYyKjwhA81SU8B+j8XWr1QqcAT+eWzrqd5S8HcOv+yZlgdkXvubRpYaBPbrhDaIcDR0FqxVypLLmYdj3ihummXfnKIOQhiD+EuAh+kVaTLsg53gylYPWRmazB6CjdALChUqVKhQoUKFCmWqKPoJfNxNrWsvdVIAAAAASUVORK5CYII=" />
                <h1 className="banner"> miraqi </h1>
                <p className="flavorText"> Your personalized discord media share room </p>
              </div>
            </div>
            <div className="row justify-content-md-center go">
              <div className="col-8">
                { displayDiv }
              </div>
            </div>
            <div className="arrow-container"><div class="arrow bounce"></div></div>
          </section>
          <section className="content">
            <div className="row justify-content-md-center">
              <div className="col-8 col-md-offset-2">
                <h1 className="banner"> share music </h1>
                <p className="flavorText"> Use our dj so you don't have to. No setup required, just jammin'.</p>
              </div>
            </div>
            <div className="row justify-content-md-center">
              <div className="col-8">
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

export default Home;
