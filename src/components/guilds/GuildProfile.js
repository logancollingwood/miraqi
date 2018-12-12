import React from "react";
import {connect} from 'react-redux'
import Config from "../../Config.js";

const mapStateToProps = (state = {}) => {
    if (state.loading) {
        return {loading: true}
    }
    return {user: state.user.profile};
};

class GuildProfile extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.loading) {
            return null;
        }
        
        let url = 'https://cdn.discordapp.com/'
        if(this.props.user.avatar) {
            url += `avatars/${this.props.user.id}/${this.props.user.avatar}.png?size=64`
        } else {
            url += `embed/avatars/${this.props.user.discriminator%5}.png?size=64`
        }

        return (
            <div className="container no-padding">
                <div className="row profile">
                <div className="col-md-4 profilePic">
                    <img style={{borderRadius: "50px", width: "64px"}} src={url}/>
                </div>
                <div className="col-md-4 no-padding userName">
                    <p className='name'>{this.props.user.username}</p>
                </div>
                <div className="col-md-4 no-padding logout left-half">
                    <a href={Config.WEB_HOST + "auth/logout"}> logout </a>
                    <p className="version"> v 1.0 </p>
                </div>
                </div>
          </div>
        );
    }
}

export default connect(mapStateToProps)(GuildProfile);