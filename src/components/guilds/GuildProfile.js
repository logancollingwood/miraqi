import React from "react";
import Config from "../../Config.js";


class GuildProfile extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let profileToRender = null;
        if (this.props.user) {
            profileToRender = 
            <div className="container no-padding">
              <div className="row profile">
                <div className="col-md-4 profilePic">
                  <img style={{borderRadius: "50px"}} src={`https://cdn.discordapp.com/avatars/${this.props.user.id}/${this.props.user.avatar}.png?size=64`}/>
                </div>
                <div className="col-md-4 no-padding userName">
                  <p className='name'>{this.props.user.username}</p>
                </div>
                <div className="col-md-4 no-padding logout left-half">
                    <a href={Config.WEB_HOST + "auth/logout"}> logout </a>
                    <p className="version"> v 1.0 </p>
                </div>
              </div>
            </div>;
        }
        return (
             profileToRender
        )
    }
}

export default GuildProfile;