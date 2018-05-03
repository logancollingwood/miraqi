import React from "react";
import moment from "moment";
import ChatMessage from "./ChatMessage";

let TIME_FORMAT = "MM YY / h:mm:ss a";

class Chat extends React.Component {
	constructor(props){
        super(props);

        this.state = {
            username: '',
            message: '',
            messages: [],
			users: this.props.room ? this.props.room.users : [],
			userNameEntryHidden: false,
			room: this.props.room
		};

		
		this.socket = this.props.socket;

    }

	componentDidMount() {
		this.sendMessage = ev => {
			if (ev.charCode === 13) {
				if(this.state.message === null || this.state.message === '' || this.props.user.username === null) return;
					this.socket.emit('SEND_MESSAGE', {
						author: this.props.user.id,
						message: this.state.message,
						timestamp: moment().format(TIME_FORMAT)
					});
				this.setState({message: ''});
			}
		}

		const addMessage = data => {
			this.setState({messages: [...this.state.messages, data]});
		};

		this.socket.on('message', function(data){
			addMessage(data);
		});

		const newUserList = userList => {
			this.setState({users: userList});
		}

		this.socket.on('users', function(usersList) {
			console.log('got new user list');
			console.log(usersList);
			newUserList(usersList);
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
						<hr />
						<div className="chatFooter">

							<div>
								{ !this.props.loading &&
									<div className="input-group mb-3">
											<div className="input-group-prepend">
												<span className="input-group-text" id="userNameLabel">{this.props.user.username}</span>
											</div>
										<input id="sendMessageInput" type="text" placeholder="Message" className="form-control" aria-describedby="userNameLabel" value={this.state.message} onChange={ev => this.setState({message: ev.target.value})} onKeyPress={this.sendMessage}/>
										<span className="input-group-btn">
											<button onClick={this.sendMessage} className="btn btn-secondary">Send</button>
										</span>
									</div>
								}
							</div>

							<hr />
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