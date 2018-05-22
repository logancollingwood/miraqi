import React from "react";
import Link from "react-router";
import GuildProfile from "./guilds/GuildProfile.js";

class Guilds extends React.Component {

    constructor(props) {
       super(props);
       
    }

    render() {
        let guildsList;
        let currentRoomId = this.props.currentRoom != null ? this.props.currentRoom.roomProviderId : -1;
        console.log(`currentRoomId: ${currentRoomId}`);
        if (this.props.user) {
            guildsList = this.props.user.guilds.slice(0).map((guild, i) => 
                <li className={`row listItem ${currentRoomId == guild.id ? 'active' : ''}`} key={i}>
                    <div className="col-md-2">
                        <div className="name"> 
                            { guild.icon ? 
                                <img src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`} />
                                :
                                <div className="guildNoIcon"> {guild.name.charAt(0)} </div>
                            }
                        </div>
                    </div>
                    <div className="col-md-9">
                        <div className="type">
                            <a href={`/rooms/discord/${guild.id}`}>{guild.name}</a>
                        </div>
                    </div>
                </li>
            );
        }
        
        if (this.props.loading) {
            return (
                <div className="guildQueue left-half">
                    <div className="header">
                         Guilds loading ...
                    </div>
                    <ul className="songQueue">
                    </ul>
                    <div className="about">
                        Loading ...
                    </div>
                </div>
            );
        } else {

            return (
                
                <div className="guildQueue">
                    <div className="header">
                         Guilds
                    </div>
                    <ul className="songQueue">
                        {guildsList}
                    </ul>
                    <div className="about">
                        <GuildProfile user={this.props.user} />
                    </div>
                </div>
            );
        }
    }
}

export default Guilds;