import io from "socket.io-client";
import {connect} from 'react-redux';
import Config from "./Config";
import {SetUserAction, NotAuthorizedAction} from "./actions/action";
import React from "react";
import SocketContext from "./context/SocketContext";

class SocketApp extends React.Component {

    socket: any;
    dispatch: any;
    props: any;

    constructor(state: any) {
        super(state);
        this.socket = io.connect(Config.SOCKET_API_HOST);
        this.state = {
            loading: true,
            loggedIn: false
        }
        let self = this;
        this.socket.emit('echo_auth');
        this.socket.on('auth_credential', function(data: any, err: any) {
        })
        this.socket.on('disconnect', function() {
        })
        this.socket.on('not_auth', function() {
            console.log('not_auth');
        })
    }

    render(): any {
        const childrenWithSocket = React.Children.map(this.props.children, child =>
            React.cloneElement(child, { socket: this.socket })
          );

        return (
            <div>
                { childrenWithSocket }
            </div>
        );
    }


}

export default connect()(SocketApp);