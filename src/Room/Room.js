import React, { Component } from "react";
import ChatRoomManager from "../components/ChatRoomManager";
import Nav from "../Nav.js";
import io from "socket.io-client";
import Config from "../Config.js";


class Room extends Component {
  constructor(props) {
    super(props);
    console.info('initializing socket');
    this.socket = io(Config.SOCKET_API_HOST);
    this.socket.emit('user joined', {roomId: this.props.match.params.id});
  }

  render() {
    console.log(this.state);
    return (
      <div>
        <Nav isHome={false} isRoom={true}/>
        <ChatRoomManager id={this.props.match.params.id} socket={this.socket}/>
      </div>
    );
  }
}

export default Room;
