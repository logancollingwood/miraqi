import React from "react";


class DjQueue extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            queue: this.props.queue
        }
        this.socket = this.props.socket;
        
        const newQueue = queue => {
			this.setState({queue: queue});
		};
        this.socket.on('queue', function(queue){
            console.log('got new queue');
            console.log(queue);
			newQueue(queue);
		});
    }

    render() {
        let queueList;
        if (this.props.queue) {
            queueList = this.props.queue.slice(0).map((queueItem, i) =>
                <li className="row queueItem" key={i}>
                    <div className="col-md-8">
                        <div className="name"> {queueItem.trackName} </div>
                    </div>
                    <div className="col-md-4">
                        <div className="type">
                            <a href={queueItem.playUrl}>
                                {queueItem.type === 'yt' ? <i className="fab fa-youtube fa-2x pull-right"></i> : ''}
                            </a>
                        </div>
                    </div>
                </li>);
        }

        return (
            <div>
                <ul className="song-queue">
                    {queueList}
                </ul>
            </div>
        );
    }
}

export default DjQueue;