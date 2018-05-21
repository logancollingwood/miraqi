import React from 'react';
import Nav from "./Nav";
import Api from "./components/Api";
import {Redirect} from 'react-router';
import FontAwesome from 'react-fontawesome'
import ip from 'ip';

class Home extends React.Component {

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
                <h1 className="homeName"> miraqi </h1>
                <p className="flavorText"> Your personalized discord media share room </p>
              </div>
            </div>
            <div className="row justify-content-md-center go">
              <div className="col-8">
                { displayDiv }
              </div>
            </div>
            <div class="arrow-container"><div class="arrow bounce"></div></div>
          </section>
          <section className="content">
            <div className="row justify-content-md-center">
              <div className="col-8 col-md-offset-2">
                <h1 className="homeName"> share music </h1>
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
