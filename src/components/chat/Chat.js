import React from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

class Chat extends React.Component {
	constructor(props){
        super(props);

        this.state = {
            username: '',
            messages: [],
			users: this.props.room ? this.props.room.users : [],
			userNameEntryHidden: false,
			room: this.props.room
		};

		
		this.socket = this.props.socket;

    }

	componentDidMount() {

		const addMessage = data => {
			this.setState({messages: [...this.state.messages, data]});
		};

		this.socket.on('message', function(data){
			console.log('got message');
			console.log(data);
			addMessage(data);
		});

		const newUserList = userList => {
			this.setState({users: userList});
		}

		this.socket.on('room', function(room) {
			console.log('got new room');
			console.log(room);
			if (room != null) {
				if (room.users != null) {
					newUserList(room.users);
				}
			}
		})

		if (this.props.room != null) {
			console.log(' room prop is not null');
			this.setState({messages: this.props.room.messages});
		}
	}

	handleKeyPress(target) {
		console.log('got a key press');
		if(target.charCode === 13){
				alert('Enter clicked!!!');    
		}

	}

    render(){
		if (this.props.loading) {
			return (
				<div className="col-md-4 chatRoom h-100 bg-bright">
					Loading...
				</div>
			)
		}
		const messagesToRender = this.state.messages.slice(0).reverse().map((message, i) => 
			<ChatMessage key={i} message={message} />
		);

        return (
                    <div className="chatRoom">
						<div className="chatMessages">
							{
								messagesToRender
							}
						</div>
						<div className="chatFooter">

							<div>
								{ !this.props.loading &&
									<ChatInput user={this.props.user} socket={this.props.socket} />
								}
							</div>

							<div className="roomInfo">
								{ this.state.users &&
									 `${this.state.users.length} users connected to room ${this.props.room._id}`
								}
							</div>
						</div>
                    </div>
        );
    }
}

export default Chat;