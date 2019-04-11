import React from "react";
import {connect} from 'react-redux';
import Style from "./style/Profile.module.scss";

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
                <div className="container-fluid connected-account">
                    <div className="row info">
                        <div className="col-md-4">
                            <img alt="discord-logo" className="brand" src="/img/Discord_Logo_Wordmark_White.png" />
                        </div>
                        <div className="col-md-8">
                            <p>{this.props.profile.username}#{this.props.profile.discriminator}</p>
                        </div>
                    </div>
                    <div className="row options">
                        <div className="col-1">
                            <i className="fas fa-cogs"></i>
                        </div>
                        <div className="col-6">
                            <button className="btn btn-primary">
                                <i className="fas fa-sync-alt"></i>
                                refresh
                            </button>
                        </div>
                        <div className="col-4">
                            <button className="btn btn-primary">
                                <i className="fas fa-trash-alt"></i>
                                delink
                            </button>
                        </div>
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

export default connect(mapStateToProps)(ProfileSidebar);
