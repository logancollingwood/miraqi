import React from "react";
import Config from "../Config.js";


class DjQueue extends React.Component {

	constructor(props) {
		super(props);
		let queue = [
            {
                name: 'Move Your Still - Feed Me Jack',
                type: 'yt',
                link: 'https://www.youtube.com/blah',
            },
            {
                name: 'test yonce2',
                type: 'yt',
                link: 'https://www.youtube.com/blah',
            },
            {
                name: 'test yonce3',
                type: 'yt',
                link: 'https://www.youtube.com/blah',
            }
        ]
        this.state = {
            queue: queue
        }
	}

    render() {
        const queueList = this.state.queue.slice(0).map((queueItem, i) => 
			<li className="row queueItem" key={i}>
                <div className="col-md-8">
                    <div className="name"> {queueItem.name} </div>
                </div>
                <div className="col-md-4">
                    <div className="type"> 
                        <a href={queueItem.link}>
                        { queueItem.type === 'yt' ?  <i className="fab fa-youtube fa-2x pull-right"></i> : ''}
                        </a>
                    </div>
                </div>
            </li>
        );
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