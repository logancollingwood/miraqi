import React from "react";
import {connect} from 'react-redux'
import Config from "../../Config.js";
import { Link } from 'react-router-dom';
import style from "./style/Guild.module.scss";

const mapStateToProps = (state = {}) => {
    if (state.loading) {
        return {loading: true}
    }
    return {user: state.user.profile};
};

class GuildProfile extends React.Component {

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
            <div className="container no-padding ">
                <div className={"row " + style.profile} >
                <div className="col-md-4">
                    <img alt="profile" className={style.profileImage} src={url}/>
                </div>
                <div className={"col-md-4 no-padding " + style.userName}>
                    <Link to="/home"><p className='name'>{this.props.user.username}</p></Link>
                </div>
                <div className={"col-md-4 no-padding " + style.logout + " left-half"}>
                    <a href={Config.WEB_HOST + "auth/logout"}> logout </a>
                    <span className={style.app_version}> v 1.0 </span>
                </div>
                </div>
          </div>
        );
    }
}

export default connect(mapStateToProps)(GuildProfile);