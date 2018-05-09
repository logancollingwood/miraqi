import React from "react";


class ChatMessage extends React.Component {

  render() {
    let message = this.props.message;
    return (
        <div className={ "message  " + (message.serverMessage ? 'server' : '')}>
            <div className="author"> {message.author} </div>
            <div className="timestamp"> {message.timestamp} </div>
            <div className="data"> {message.message} </div>
        </div>
    );
  }
}

export default ChatMessage;
