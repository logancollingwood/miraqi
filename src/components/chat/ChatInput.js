import React from "react";
import moment from "moment";
import {connect} from 'react-redux'

let TIME_FORMAT = "MM YY / h:mm:ss a";

const mapStateToProps = (state = {}) => {
	console.log(state)
	return {
        userName: state.user.profile.username,
        userId: state.user._id
	};
};

class ChatInput extends React.Component {
    constructor(props) {
        super(props);
		const {dispatch} = this.props
        this.state = {
            message: '',
        }
        this.socket = this.props.socket;
        this.processSend = () => {
            if(this.state.message === null || this.state.message === '' || this.props.userName === null) {
                return;
            }
            console.log(`sending message : ${this.state.message}`)
            this.socket.emit('SEND_MESSAGE', {
                author: this.props.userId,
                message: this.state.message,
                timestamp: moment().format(TIME_FORMAT)
            });
            this.setState({message: ''});
        }

        this.enterKey = ev => {
			if (ev.charCode === 13) {
				this.processSend();
			}
        }

        this.sendButtonClick = () => {
            this.processSend();
        }
    }


    render() {
        return (
            <div className="container chat no-padding"> 
                <div className="row no-padding">
                    <div className="col-md-10 no-padding messageInput">
                        <input id="sendMessageInput" type="text" placeholder="Message" 
                            className="form-control" aria-describedby="userNameLabel" 
                            value={this.state.message} onChange={ev => this.setState({message: ev.target.value})} 
                            onKeyPress={this.enterKey}/>
                    </div>
                    <div className="col-md-2 no-padding sendButton">
                        <button id="sendMessageButton" onClick={this.sendButtonClick} className="btn btn-secondary">Send</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(ChatInput);