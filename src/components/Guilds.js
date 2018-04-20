import React from "react";
import Link from "react-router";

class Guilds extends React.Component {

    constructor(props) {
       super(props);
       
    }

    render() {
        let guildsList;
        let currentRoomId = this.props.currentRoom != null ? this.props.currentRoom.id : -1;
        console.log(`currentRoomId: ${currentRoomId}`);
        if (this.props.guilds) {
            guildsList = this.props.guilds.slice(0).map((guild, i) => 
                // {`row listItem ${currentRoomId === guild.id ? 'active' : ''}`}
                <li className={`row listItem ${i == 0 ? 'active' : ''}`} key={i}>
                    <div className="col-md-2">
                        <div className="name"> 
                            <img src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`} />
                        </div>
                    </div>
                    <div className="col-md-9">
                        <div className="type">
                            <a href={`/rooms/${guild.id}`}>{guild.name}</a>
                        </div>
                    </div>
                </li>
            );
        }
        
        if (this.props.loading) {
            return (
                <div className="guildQueue">
                    <div className="queueHeader">
                        <div className="name"> Guilds loading ...</div>
                    </div>
                    <ul className="songQueue">
                    </ul>
                </div>
            );
        } else {

            return (
                
                <div className="guildQueue">
                    <div className="queueHeader">
                        <div className="name"> Guilds </div>
                    </div>
                    <ul className="songQueue">
                        {guildsList}
                    </ul>
                </div>
            );
        }
    }
}

export default Guilds;