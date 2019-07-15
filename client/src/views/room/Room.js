import React, { Component } from "react";
import ChatRoomManager from "../../components/ChatRoomManager";
import Nav from "../../components/nav/Nav";
import { connect } from 'react-redux';
import { withRouter } from "react-router";
import {NotAuthorizedAction} from "../../actions/action";
import styles from "../../components/global/Globals.module.scss";
import SocketContext from "../../context/SocketContext";

const mapStateToProps = (state = {}) => {
    return {};
};

class Room extends Component {

  static contextType = SocketContext;

  constructor(props, context) {
    super(props);
    const {dispatch} = this.props;
    this.socket = context;
    let roomId = this.props.match.params.id;
    if (!(roomId === null || roomId === undefined)) {
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
          <Nav />
          <div className={"container-fluid " + styles.mainContent}>
            <ChatRoomManager id={this.props.match.params.id} />
          </div>
        </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(Room));