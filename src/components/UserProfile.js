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
        <div>
          <img style={{borderRadius: "50px"}} src={`https://cdn.discordapp.com/avatars/${this.props.user.id}/${this.props.user.avatar}.png?size=64`}/>
          <p className='name'>{this.props.user.username}</p>
        </div>;
    } else {
        profileToRender = 
          <div>
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
