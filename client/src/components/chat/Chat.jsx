import React from "react";
import {connect} from 'react-redux'
import { withRouter } from "react-router";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import {AddMessageAction} from '../../actions/action';
import styles from "./style/Chat.module.scss";
import SocketContext from './../../context/SocketContext';

const mapStateToProps = (state = {}) => {
	return {
		messages: state.messages, 
		username: state.user.name, 
		roomId: state.id, 
		users: state.users, 
		loading: state.loading,
		user: state.user
	};
};

class Chat extends React.Component {
	
	static contextType = SocketContext;
    
	constructor(props, context) {
		super(props);
		this.socket = context;

		const {dispatch} = this.props

		this.socket.on('message', function(data){
			dispatch(AddMessageAction(data))
		});

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
		const messagesToRender = this.props.messages.slice(0).reverse().map((message, i) => {
			console.log("message")
			console.log(message);
			console.log("user")
			console.log(this.props.user);
			const isSentByMe = this.props.user.profile.username === message.author;
			return (<ChatMessage key={i} message={message} isSentByMe={isSentByMe}/>);
		});

        return (
                    <div className={"chatRoom " + styles.chat_container}>
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
								{ this.props.users &&
									 `${this.props.users.length} users connected to room ${this.props.roomId}`
								}
							</div>
						</div>
                    </div>
        );
    }
}

export default withRouter(connect(mapStateToProps)(Chat));