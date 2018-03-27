import React, { Component } from "react";
import ChatRoomManager from "../components/ChatRoomManager";
import Nav from "../Nav.js";
import io from "socket.io-client";
import Config from "../Config.js";


class Room extends Component {
  constructor(props) {
    super(props);
    this.socket = io(Config.SOCKET_API_HOST);
    this.state = {
      loading: true
    }
  }

  render() {
    console.log(this.state);
    return (
      <div>
        <Nav loading={this.state.loading} isHome={false} isRoom={true}/>
        <ChatRoomManager id={this.props.match.params.id} loading={this.state.loading} socket={this.socket}/>
      </div>
    );
  }
}

export default Room;
