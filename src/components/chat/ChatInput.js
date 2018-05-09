import React from "react";
import moment from "moment";

let TIME_FORMAT = "MM YY / h:mm:ss a";

class ChatInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            message: '',
        }

        this.socket = this.props.socket;
        
        this.processSend = () => {
            if(this.state.message === null || this.state.message === '' || this.props.user.username === null) return;
                console.log(`sending message : ${this.state.message}`)
                this.socket.emit('SEND_MESSAGE', {
                    author: this.props.user.id,
                    message: this.state.message,
                    timestamp: moment().format(TIME_FORMAT)
                });
				this.setState({message: ''});
        }

        this.enterKey = ev => {
            console.log('hit send');
			if (ev.charCode === 13) {
				this.processSend();
			}
        }

        this.sendButtonClick = () => {
            this.processSend();
        }
    }

    componentDidMount() {
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

module.exports = ChatInput;