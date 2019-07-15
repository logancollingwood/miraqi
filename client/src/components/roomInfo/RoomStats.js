import React from "react";
import {connect} from 'react-redux';
import {SetStatsAction} from "../../actions/action";
import moment from "moment";
import { withRouter } from 'react-router-dom';
import SocketContext from './../../context/SocketContext';


const mapStateToProps = (state = {}) => {
	return {
        stats: state.stats,
        userId: state.user._id
	};
};

let TIME_FORMAT = "MM YY / h:mm:ss a";
let PLAY_PREFIX = "!play";

class RoomStats extends React.Component {

    static contextType = SocketContext;
    
	constructor(props, context) {
		super(props);
		this.socket = context;
		const {dispatch} = this.props;

		this.socket.on('stats', function(data) {
			dispatch(SetStatsAction(data));
        });
        
        this.reQueueTopSong = this.reQueueTopSong.bind(this);
    }

    reQueueTopSong = (link) => {
        console.log('got requeue');
        let message = `${PLAY_PREFIX} ${link}`;
        this.socket.emit('SEND_MESSAGE', {
            author: this.props.userId,
            message: message,
            timestamp: moment().format(TIME_FORMAT)
        });
    }

	render() {
        let statsList;
        if (this.props.stats && this.props.stats.length > 0) {
            statsList = this.props.stats.slice(0).map(function(statItem, i) {
                let numberToRender = <div className="queue-number"> #{i+1} </div>;
                return (
                    <li className="row queue-item" key={i}>
                        <div className="col-md-1">
                            {numberToRender}
                        </div>
                        <div className="col-md-8">
                            <div className="name pull-left"> {statItem.title} </div>
                        </div>
                        <div className="col-md-2">
                        	<div className="play-count">
                        		{statItem.count}
                        	</div>
                        </div>
                        <div className="col-md-1">
                            <div className="type">
                                <i className="fas fa-plus pull-right" link={statItem.playUrl} onClick={() => this.reQueueTopSong(statItem.playUrl)}></i>
                            </div>
                        </div>
                    </li>
                );
            }, this);
        }
		return (
			<div className="DjQueue">
                <div className="row justify-content-end header">
                    <div className="col-md-12">
                        Top Links 
                    </div>
                </div>
                <ul className="songQueue">
                    {statsList}
                </ul>
            </div>
		);
	}
}

export default withRouter(connect(mapStateToProps)(RoomStats));