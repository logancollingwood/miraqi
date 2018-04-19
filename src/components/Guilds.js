import React from "react";


class Guilds extends React.Component {

    constructor(props) {
        super(props);
       
    }

    render() {
        let guildsList;
        if (this.props.guilds) {
            guildsList = this.props.guilds.slice(0).map((guild, i) =>
                <li className="row queueItem" key={i}>
                    <div className="col-md-1">
                        <div className="name"> {guild.trackName} </div>
                    </div>
                    <div className="col-md-4">
                        <div className="type">
                            {guild.name}
                        </div>
                    </div>
                </li>);
        }

        return (
            <div className="guildQueue bg-dark">
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

export default Guilds;