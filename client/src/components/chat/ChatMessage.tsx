import React from "react";
import styles from "./style/Chat.module.scss";

type Message = {
  serverMessage: boolean,
  author: string,
  timestamp: string,
  message: string
}
type Props = {
  message: Message,
  isSentByMe: boolean
}
type State  = {}

class ChatMessage extends React.Component<Props, State> {

  render() {
    let message = this.props.message;
    let style = null;
    if (message.serverMessage) {
      style = styles.server_message;
    } else if (this.props.isSentByMe) {
      style = styles.is_sent_by_me;
    }

    console.log(style)
    return (
        <div className={styles.chat_message + " " + style}>
            <div className="author"> {message.author} </div>
            <div className="timestamp"> {message.timestamp} </div>
            <div className="data"> {message.message} </div>
        </div>
    );
  }
}

export default ChatMessage;
