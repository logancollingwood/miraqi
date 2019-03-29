import React, { Component } from "react";
import ChatRoomManager from "../../components/ChatRoomManager";
import API from "../../components/Api";
import Nav from "../../components/nav/Nav";
import io from "socket.io-client";
import Config from "../../Config.js";
import cookie from 'react-cookie';
import { isNullOrUndefined } from "util";
import {connect} from 'react-redux';
import {NotAuthorizedAction} from "../../actions/action";
import styles from "../../components/global/Globals.module.scss";


const mapStateToProps = (state = {}) => {
    return {};
};

class Room extends Component {

  constructor(props) {
    super(props);
    const {dispatch} = this.props;
    let roomId = this.props.match.params.id;
    if (!(roomId === null || roomId === undefined)) {
      this.socket = io.connect(Config.SOCKET_API_HOST);
      sendJoinRequest.bind(this)();
    }

    this.state = {
      user: null
    }

    this.socket.on('send_auth', () => {
      console.log('sever requested auth');
      sendJoinRequest.bind(this)();
    });

    function sendJoinRequest() {
      let joinRequest = {
        roomId: this.props.match.params.id
      }
      this.socket.emit('join', joinRequest);
    }

    this.socket.on('not_auth', function() {
      console.log('not_auth');
			dispatch(NotAuthorizedAction());
    })
  }

  render() {
    return (
        <div>
          <Nav isHome={false} isRoom={true} user={this.state.user}/>
          <div className={"container-fluid " + styles.mainContent}>
            <ChatRoomManager id={this.props.match.params.id} socket={this.socket}/>
          </div>
        </div>
    );
  }
}

export default connect(mapStateToProps)(Room);