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
			ev.preventDefault();
			if(this.state.message === null || this.state.message === '') return;
			this.socket.emit('SEND_MESSAGE', {
				author: this.state.username,
				message: this.state.message,
				serverMessage: false,
				timestamp: moment().format(TIME_FORMAT)
			});
			this.setState({message: ''});
		}

		this.setUsername = ev => {
			this.setState({
				userNameEntryHidden: true,
				chatHidden: false
			})
			this.socket.emit("subscribe", { room: this.props.currentRoom, username: this.state.username });
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
	}


    render(){
		const messagesToRender = this.state.messages.slice(0).reverse().map((message, i) => 
			<ChatMessage key={i} message={message} />
		);

        return (
                    <div className="col-md-4 chatRoom h-100 bg-bright">
                                <div className="chatTitle">{this.props.currentRoom}</div>
                                <hr/>
                                <div className="chatMessages">
									{
										messagesToRender
									}
								</div>
								<hr />
                                <div className="chatFooter">

									<div className={this.state.userNameEntryHidden ? 'hidden' : ''}>
										<input type="text" placeholder="Username" value={this.state.username} onChange={ev => this.setState({username: ev.target.value})} className="form-control"/>
										<button onClick={this.setUsername} className="btn btn-primary form-control">Set</button>
									</div>


									<div className={this.state.chatHidden ? 'hidden' : ''}>
										<label id="userNameLabel" htmlFor="sendMessageInput">  {this.state.username} </label>
										<input id="sendMessageInput" type="text" placeholder="Message" className="form-control" value={this.state.message} onChange={ev => this.setState({message: ev.target.value})}/>
										<button onClick={this.sendMessage} className="btn btn-primary form-control">Send</button>
									</div>
	
									<div className="roomUsers">
										{this.state.users.length} users connected
									</div>
                                </div>
                    </div>
        );
    }
}

export default Chat;