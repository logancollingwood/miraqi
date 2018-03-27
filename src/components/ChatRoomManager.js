import React from "react";
import Chat from "./Chat";
import DjContainer from "./DjContainer.js";
import Api from "../components/Api.js";

class ChatRoomManager extends React.Component {

	constructor(props) {
		super(props);
		this.socket = this.props.socket;
		console.log(this.props);
		this.state = {
			loading: true,
			room: null,
		}
	}

	componentDidMount() {
		console.log(this.props.id);
		console.log(`going to search for room with id: ${this.props.id}`);
		Api.getRoomById(this.props.id)
			.then(room => {
				console.log(`found room:`);
				console.log(room);
				this.setState({loading: false, room: room});
			}).catch(error => console.error);


		this.socket.on('SYNC_ROOM', function(room){
			console.log('client got sync');
			console.log(room);
			this.setState({room: room});
		}.bind(this));
	}


    render() {
		console.log(`got new room`);
		console.log(this.state);
        return (
			<div className="container-fluid">
				<div className="row justify-content-center main-content">
					<div className="col-md-9 no-padding left-half">
						<DjContainer loading={this.state.loading} room={this.state.room} socket={this.socket}/>
					</div>
					<div className="col-md-3 no-padding">
						<Chat loading={this.state.loading} socket={this.socket} room={this.state.room}/>
					</div>
				</div>
			</div>
        );
    }
}

export default ChatRoomManager;