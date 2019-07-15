import React from "react";
import DjQueue from "../DjQueue";
import {connect} from 'react-redux'
import RoomStats from "./RoomStats";
import TopSongs from "./TopSongs";
import { withRouter } from 'react-router';

const mapStateToProps = (state = {}) => {
	return {
		
	};
};

class RoomInfo extends React.Component {

	render() {
		return (
				<div className="row info">
					<div className="col-md-6 left-half no-padding queue">
						<DjQueue socket={this.props.socket} queue={null} />
					</div>
					<div className="col-md-6 no-padding">
						<div className="top-queue">
							<RoomStats socket={this.props.socket}/>
							<TopSongs />
						</div>
					</div>
				</div>
		);
	}
}

export default withRouter(connect(mapStateToProps)(RoomInfo));