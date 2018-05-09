import React, { Component } from "react";
import Config from "../Config.js";



class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.loginLink = Config.WEB_HOST + "login/discord";
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
            <div className="col-md-4 no-padding logout">
                <a href={Config.WEB_HOST + "auth/logout"}> logout </a>
                <p className="version"> v 1.0 </p>
            </div>
          </div>
        </div>;
    } else {
        profileToRender = 
          <div className="row">
            <p className="name">Loading</p>
            <a href={this.loginLink} className="nav-link"><i className="fab fa-discord"></i> Login </a>
          </div>;
    }
    return (
      <div>
        {profileToRender}
      </div>
    );
  }
}

export default UserProfile;
