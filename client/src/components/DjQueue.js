import React from "react";
import {UpdateQueueAction, SetSkippingAction} from "../actions/action";
import {connect} from 'react-redux'
import { withRouter } from "react-router";
import SocketContext from './../context/SocketContext';

const mapStateToProps = (state = {}) => {
    return {
        queue: state.queue,
        isSkipping: state.skipping
    };
};

class DjQueue extends React.Component {

    static contextType = SocketContext;
    
	constructor(props, context) {
		super(props);
        this.socket = context;
        
        const {dispatch} = this.props
        
        const newQueue = queue => {
            dispatch(UpdateQueueAction(queue));
        };

        const resetSkip = () => {
            dispatch(SetSkippingAction(false));
        }

        this.socket.on("NEW_QUEUE", function(queue){
            console.log('got new queue');
            console.log(queue);
			newQueue(queue);
        });
        
        this.socket.on('NO_QUEUE', function() {
            newQueue([]);
        });
        
        this.socket.on('play', function (data) {
			resetSkip();
        });

        this.socket.on('nowPlaying', function(data) {
			resetSkip();
		});
        
        this.skip = () => {
            // don't force re-render if already skipping
            if (this.props.skipping) {
                return;
            }
            this.socket.emit('skip_track', {});
            dispatch(SetSkippingAction(true));
        }
    }

    render() {
        let queueList;
        if (this.props.queue && this.props.queue.length > 0) {
            queueList = this.props.queue.slice(0).map(function(queueItem, i) {
                let isFirst = (i === 0);
                let numberToRender;
                if (isFirst) {
                    numberToRender = <div className="queue-number first"> now playing </div>;
                } else {
                    numberToRender = <div className="queue-number"> #{i+1} </div>;
                }
                if (queueItem === null) return <></>;
                return (
                    <li className="row queue-item" key={i}>
                        <div className="col-md-3">
                            {numberToRender}
                        </div>
                        <div className="col-md-8">
                            <div className="name pull-left"> {queueItem.trackName} </div>
                        </div>
                        <div className="col-md-1">
                            <div className="type">
                                <a href={queueItem.playUrl} target="_blank" rel="noopener noreferrer">
                                    {queueItem.type === 'yt' ? <i className="fab fa-youtube fa-2x pull-right"></i> : ''}
                                </a>
                            </div>
                        </div>
                    </li>
                );
            });
        }

        let skipOrNot = this.props.skipping ? 
                <i className="fas fa-check"></i> 
            :
                <div className="skip"><i className="fas fa-arrow-right" onClick={this.skip}></i><p>skip</p></div>;

        return (
            <div className="DjQueue">
                <div className="row justify-content-end header">
                    <div className="col-6 col-sm-5 col-md-6">
                        On Deck
                    </div>
                    <div className="col-6 col-sm-7 col-md-6" >
                        {skipOrNot}
                    </div>
                </div>
                <ul className="songQueue">
                    {queueList}
                </ul>
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps)(DjQueue));