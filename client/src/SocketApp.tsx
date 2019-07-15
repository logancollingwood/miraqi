import {connect} from 'react-redux';
import Config from "./Config";
import {SetUserAction, NotAuthorizedAction} from "./actions/action";
import React from "react";
import SocketContext from "./context/SocketContext";
import { withRouter } from 'react-router';


const mapStateToProps = (state = {}) => {
  return {};
};
class SocketApp extends React.Component {

    dispatch: any;
    props: any;
    socket: SocketIOClient.Emitter;
    static contextType = SocketContext;

    constructor(props: any, context: any) {
        super(props);
        this.state = {
            loading: true,
            loggedIn: false
        }
        this.dispatch  = props.dispatch;
        this.socket = context;
        let self = this;
        this.socket.emit('initialize');
        this.socket.emit('echo_auth');
		this.socket.on('auth_credential', function(data: any, err: any) {
			self.setState({
				loggedIn: true,
				loading: false
			});
			self.dispatch(SetUserAction(data));
		})
		this.socket.on('disconnect', function() {
            console.log('forced disconnect');
			self.dispatch(NotAuthorizedAction());
		})
		this.socket.on('not_auth', function() {
			console.log('not_auth');
			self.dispatch(NotAuthorizedAction());
		})
    }

    render(): any {

        return (
            <SocketContext.Provider value={this.context}>
              {this.props.children} 
            </SocketContext.Provider>
        );
    }


}

export default withRouter(connect()(SocketApp) as any);