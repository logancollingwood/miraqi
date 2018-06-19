import React, { Component } from "react";
import ChatRoomManager from "../components/ChatRoomManager";
import API from "../components/Api.js";
import Nav from "../Nav.js";
import io from "socket.io-client";
import Config from "../Config.js";
import cookie from 'react-cookie';
import { isNullOrUndefined } from "util";


class Room extends Component {
  constructor(props) {
    super(props);
    let roomId = this.props.match.params.id;
    if (!(roomId === null || roomId === undefined)) {
      this.socket = io.connect(Config.SOCKET_API_HOST);
      let joinRequest = {
        roomId: this.props.match.params.id
      }
      this.socket.emit('join', joinRequest);
    }

    this.state = {
      user: null
    }

    this.socket.on('not_auth', function() {
      this.setState({
        
      })
    })
  }

  render() {
    return (
        <div>
          <Nav isHome={false} isRoom={true} user={this.state.user}/>
          <ChatRoomManager id={this.props.match.params.id} socket={this.socket}/>
        </div>
    );
  }
}

export default Room;
