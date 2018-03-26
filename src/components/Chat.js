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
			users: [],
			userNameEntryHidden: false,
			chatHidden: true
		};
		
		this.socket = this.props.socket;

    }

	componentDidMount() {
		this.sendMessage = ev => {
			if (ev.charCode == 13) {
				if(this.state.message === null || this.state.message === '') return;
				this.socket.emit('SEND_MESSAGE', {
					author: this.state.username,
					message: this.state.message,
					serverMessage: false,
					timestamp: moment().format(TIME_FORMAT)
				});
				this.setState({message: ''});
			}
		}

		this.setUsername = ev => {
			if(ev.charCode==13){
				console.log(this.props);
				this.setState({
					userNameEntryHidden: true,
					chatHidden: false
				})
				this.socket.emit("subscribe", { room: this.props.room, username: this.state.username });
			}
		}

		const addMessage = data => {
			this.setState({messages: [...this.state.messages, data]});
		};

		this.socket.on('RECEIVE_MESSAGE', function(data){
			addMessage(data);
		});

		const addUser = data => {
			console.log(data);
			this.setState({users: [...this.state.users, data.userName]});
			console.log(this.state.users);

		}
		this.socket.on('USER_JOINED', function(data) {
			addUser(data);
		});

		if (this.props.room != null) {
			console.log(' room prop is not null');
			this.setState({messages: this.props.room.messages});
		}
	}

	handleKeyPress(target) {
		console.log('got a key press');
		if(target.charCode==13){
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

							<div class="chat">
								{ !this.state.userNameEntryHidden &&
									<div className="input-group mb-3">
										<input type="text" placeholder="Username" value={this.state.username} onChange={ev => this.setState({username: ev.target.value})} onKeyPress={this.setUsername} className="form-control"/>
										<span className="input-group-btn">
											<button className="btn btn-secondary" type="button" onClick={this.setUsername}>Set</button>
										</span>
									</div>
								}


								{ !this.state.chatHidden &&
									<div className="input-group mb-3">
											<div className="input-group-prepend">
												<span className="input-group-text" id="userNameLabel">{this.state.username}</span>
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
								{this.props.room.users.length} users connected to room {this.props.room._id}
							</div>
						</div>
                    </div>
        );
    }
}

export default Chat;