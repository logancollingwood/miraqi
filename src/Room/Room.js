import React, { Component } from "react";
import ChatRoomManager from "../components/ChatRoomManager";
import Nav from "../Nav.js";
import Api from "../components/Api.js";

class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      room: null,
    }
  }

  componentDidMount() {
     Api.getRoomById(this.props.match.params.id)
        .then(room => {
          this.setState({loading: false, room: room});
        })
        .catch(error => console.error);
  }

  render() {
    console.log(this.props);
    return (
      <div>
        <Nav isHome={false} isRoom={true} currentRoom={this.state.room}/>
        <ChatRoomManager loading={this.state.loading} roomId={this.props.match.params.id} currentRoom={this.state.room}/>
      </div>
    );
  }
}

export default Room;
