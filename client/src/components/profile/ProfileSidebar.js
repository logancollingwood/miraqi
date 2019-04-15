import React from "react";
import {connect} from 'react-redux';
import { withRouter } from 'react-router';

const mapStateToProps = (state = {}) => {
    let profile = state.user ? state.user.profile : null;
    return {
        profile: profile
    };
};

class ProfileSidebar extends React.Component {

    render () {
        let connectedAccounts;
        if (this.props.profile) {
            connectedAccounts = (
                <div class="card border-dark mb-3">
                    <h5 class="card-header">Discord</h5>
                    <div class="card-body">
                        <h5 class="card-title">{this.props.profile.username} #{this.props.profile.discriminator}</h5>
                        <a href="#" class="btn btn-dark"><i className="fas fa-sync-alt"></i>  refresh</a>
                        <a href="#" class="btn btn-dark"><i className="fas fa-trash-alt"></i>  delink</a>
                    </div>
                    <div class="card-footer">
                        last synced: 3 mins ago
                    </div>
                </div>
            )
        }
        return (
            <div>
                <h1 className="side-banner"> Connected Accounts </h1>
                {connectedAccounts}
            </div>
        )
    }
}

export default withRouter(connect(mapStateToProps)(ProfileSidebar));
