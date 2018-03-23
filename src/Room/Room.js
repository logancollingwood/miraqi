import React, { Component } from "react";
import ChatRoomManager from "../components/ChatRoomManager";
import Nav from "../Nav.js";


class Room extends Component {

  render() {
  	console.log(this.props);
    return (
		<div>
	    	<Nav isHome={false} isRoom={true} currentRoom={this.props.match.params.id}/>
				<ChatRoomManager roomId={this.props.match.params.id}/>
        </div>
    );
  }
}

export default Room;
