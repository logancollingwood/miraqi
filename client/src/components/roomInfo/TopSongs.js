import React from "react";
import {connect} from 'react-redux'
import { withRouter } from 'react-router';

const mapStateToProps = (state = {}) => {
	return {
		
	};
};

class TopSongs extends React.Component {

	render() {
		return (
				<div>
						
				</div>
		);
	}
}

export default withRouter(connect(mapStateToProps)(TopSongs));