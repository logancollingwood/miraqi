import React from "react";
import {connect} from 'react-redux'

const mapStateToProps = (state = {}) => {
	return {
		
	};
};

class TopSongs extends React.Component {

	render() {
		return (
				<div>
						Top Songs
				</div>
		);
	}
}

export default connect(mapStateToProps)(TopSongs);