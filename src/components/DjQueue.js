import React from "react";


class DjQueue extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            queue: this.props.queue,
            playing: false,
            skipping: false
        }
        this.socket = this.props.socket;
        
        const newQueue = queue => {
            console.log('updating queue to:')
            console.log(queue);
			this.setState({queue: queue});
        };

        const resetSkip = () => {
            this.setState({
                skipping: false,
                playing: true
            })
        }
        
        this.socket.on('queue', function(queue){
            console.log('got new queue');
            console.log(queue);
			newQueue(queue);
        });
        
        this.socket.on('no_queue', function() {
            newQueue([]);
        });
        
        this.socket.on('play', function (data) {
			resetSkip();
        });
        
        this.skip = () => {
            console.log('skip click');
            // don't force re-render if already skipping
            if (this.state.skipping) return;
            if (!this.state.playing) return;
            this.socket.emit('skip_track', {});
            this.setState({
                skipping: true,
            });
        }
    }

    render() {
        let queueList;
        if (this.state.queue && this.state.queue.length > 0) {
            queueList = this.state.queue.slice(0).map((queueItem, i) =>
                <li className="row queueItem" key={i}>
                    <div className="col-md-1">
                        <div className="queue-number"> {i+1} </div>
                    </div>
                    <div className="col-md-9">
                        <div className="name"> {queueItem.trackName} </div>
                    </div>
                    <div className="col-md-2">
                        <div className="type">
                            <a href={queueItem.playUrl}>
                                {queueItem.type === 'yt' ? <i className="fab fa-youtube fa-2x pull-right"></i> : ''}
                            </a>
                        </div>
                    </div>
                </li>);
        }

        let skipOrNot = this.state.skipping ? 
                <i className="fas fa-check"></i> 
            :
                <div className="skip"><i className="fas fa-arrow-right" onClick={this.skip}></i><p>skip</p></div>;

        return (
            <div className="DjQueue">
                <div className="row justify-content-end header">
                    <div className="col-md-7">
                        On Deck
                    </div>
                    <div className="col-md-3" >
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

export default DjQueue;