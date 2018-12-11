import React from "react";
import {connect} from 'react-redux'

const mapStateToProps = (state = {}) => {
	return {
		
	};
};

class RoomStats extends React.Component {

	render() {
		return (
				<div>
					Stats
				</div>
		);
	}
}

export default connect(mapStateToProps)(RoomStats);