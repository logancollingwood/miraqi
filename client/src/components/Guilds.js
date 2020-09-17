import React from "react";
import { Link } from 'react-router-dom'
import GuildProfile from "./guilds/GuildProfile";
import { withRouter } from "react-router";
import {connect} from 'react-redux'
import style from "./guilds/style/Guild.module.scss";
import globals from "../styles/main.module.scss";

const mapStateToProps = (state = {}) => {
    let guilds = state.user.profile ? state.user.profile.guilds : [];
    return {
        guilds: guilds, 
        user: state.user, 
        room: state.room,
        loading: state.loading
    };
};

class Guilds extends React.Component {

    render() {
        let guildsList;
        let currentRoomId = this.props.room ? this.props.room.roomProviderId : -1;

        if (this.props.loading) {
            return (
                <div>
                    <div className={style.guild_header}>
                        <i className="fas fa-users"></i> Guilds
                    </div>
                    <div className="guildQueue left-half">
                        <ul className="songQueue">
                        </ul>
                        <div className="about">
                            Loading ...
                        </div>
                    </div>
                </div>
            );
        } else {
            guildsList = this.props.guilds.slice(0).map((guild, i) => 
                <Link to={`/rooms/discord/${guild.id}`}>
                    <li className={`${currentRoomId === guild.id ? 'active ' : ''}row`} key={i}>
                        
                            <div className="col-md-1 col-lg-4 col-xl-3">
                                <div className="name"> 
                                    { guild.icon ? 
                                        <img alt="guild icon" src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`} />
                                        :
                                        <div className={style.guild_no_icon}> {guild.name.charAt(0)} </div>
                                    }
                                </div>
                            </div>
                            <div className="col-md-11 col-lg-8 col-xl-9">
                                <div className="type d-none d-md-block">
                                    {guild.name}
                                </div>
                            </div>
                    </li>
                </Link>
            );
            return (
                <div>
                    <div className={style.guild_header}>
                        <i className="fas fa-users"></i> Guilds <i className={"fas fa-users " + globals.guilds_container__collapse_icon}></i>
                    </div>
                    <div className={style.guild_container}>
                        <ul className={style.guild_list}>
                            {guildsList}
                        </ul>
                    </div>
                    <div className={style.guild_profile_container}>
                        <GuildProfile user={this.props.user} />
                    </div>
                </div>
            );
        }
    }
}

export default withRouter(connect(mapStateToProps)(Guilds));