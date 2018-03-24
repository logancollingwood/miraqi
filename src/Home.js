import React from 'react';
import Nav from "./Nav";
import Api from "./components/Api";
import {Redirect} from 'react-router';
import ip from 'ip';

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      redirectRoomId: '',
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
        this.setState({redirect: true, redirectRoomId: roomResponse._id});
      })
    .catch(err => console.error)
  }

  render() {
    console.log(this.state);
     if (this.state.redirect) {
       console.log("attempting redirect");
       return <Redirect to={'/rooms/' + this.state.redirectRoomId} push />;
     }
    return (
      <div>
        <Nav isHome={true}/>
        <div className="container-fluid home">
          <div className="content">
            <div className="row justify-content-md-center">
              <div className="col-8">
                <h1 className="name"> eden </h1>
              </div>
            </div>
            <div className="row justify-content-md-center jobs">
              <div className="col-8">
                <h2 className="title"> get a room </h2>
                <button onClick={this.createRoom.bind(this)}> create one. </button> 
              </div>
            </div>
          </div>
        </div>
      </div>

    )
  }
}

export default Home;
