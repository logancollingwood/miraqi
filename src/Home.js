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
      name: 'Fresh Room', 
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
    let displayDiv;
    if (this.state.loading) {
      displayDiv = (<FontAwesome name="spinner" pulse />);
    } else {
      displayDiv =  (<div>
                      <h2 className="title"> get a room </h2>
                      <button onClick={this.createRoom.bind(this)}> create one. </button> 
                    </div>);
    }
    if (this.state.redirect) {
       console.log("attempting redirect");
       return <Redirect to={'/rooms/' + this.state.redirectRoomId} />;
    }
    return (
      <div>
        <Nav isHome={true} loading={this.state.loading}/>
        <div className="container-fluid home">
          <div className="content">
            <div className="row justify-content-md-center">
              <div className="col-8">
                <h1 className="homeName"> eden </h1>
              </div>
            </div>
            <div className="row justify-content-md-center go">
              <div className="col-8">
                { displayDiv }
              </div>
            </div>
          </div>
        </div>
      </div>

    )
  }
}

export default Home;
