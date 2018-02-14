import React, { Component } from "react";
import ChatRoomManager from "../components/ChatRoomManager";
import Nav from "../Nav.js";



class Room extends Component {

  state = {
    backgroundColorHex: "#000000",
    colorPopupOpen: false,
  }

  constructor(props) {
    super(props)
    this.bgColorCallback = this.bgColorCallback.bind(this);
  }

  bgColorCallback(color, popupOpen) {
      this.setState({
          backgroundColorHex: color.hex,
          backgroundColor: color.hsl,
          colorPopupOpen: popupOpen
      });
  }

  spawnComponent = (component) => {

  }

  render() {
  	console.log(this.props);
    return (
		<div>
	    	<Nav isHome={false} isRoom={true} currentRoom={this.props.match.params.id}/>
				<ChatRoomManager currentRoom={this.props.match.params.id}/>
        </div>
    );
  }
}

export default Room;
