import React from "react";
import {connect} from 'react-redux';
import {SetStatsAction} from "../../actions/action";

const mapStateToProps = (state = {}) => {
	return {
		stats: state.stats
	};
};

class RoomStats extends React.Component {

	constructor(props) {
		super(props);
		this.socket = this.props.socket;
		const {dispatch} = this.props;

		this.socket.on('stats', function(data) {
			dispatch(SetStatsAction(data));
		})
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
                                <i className="fas fa-plus pull-right"></i>
                            </div>
                        </div>
                    </li>
                );
            });
        }
		let display = this.props.stats ? this.props.stats.length : "0";
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

export default connect(mapStateToProps)(RoomStats);