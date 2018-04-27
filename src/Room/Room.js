import React, { Component } from "react";
import ChatRoomManager from "../components/ChatRoomManager";
import API from "../components/Api.js";
import Nav from "../Nav.js";
import io from "socket.io-client";
import Config from "../Config.js";
import cookie from 'react-cookie';




class Room extends Component {

  constructor(props) {
    super(props);
    console.info('initializing socket');
    let connectSid = cookie.load('connect.sid');
    console.log(`found cookie:${connectSid}`);
    console.log(connectSid);
    this.socket = io.connect(Config.SOCKET_API_HOST);
    API.getUser()
      .then(user => {
         let joinRequest = {
          "userName": user.name,
          providerLoginId: user.discordId,
          loginProviderType: 'discord',
          roomId: this.props.match.params.id
        }
        this.socket.emit('join', joinRequest);
      })
      .catch(err => console.error(err));
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
