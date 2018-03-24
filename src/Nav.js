import React from 'react';
import moment from "moment";
import { Link } from 'react-router-dom'

const DATE_FORMAT = "MM YY";
const TIME_FORMAT = "h:mm:ss a";

class Nav extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentRoom: this.props.currentRoom ? this.props.currentRoom : 1,
	    date: moment().format(DATE_FORMAT),
      time: moment().format(TIME_FORMAT),
      room: this.props.currentRoom
    }
  }

  tick() {
    if (!this.props.loading) {
       this.setState({
          date: moment().format(DATE_FORMAT),
          time: moment().format(TIME_FORMAT)
      });
    }
  }
  componentDidMount() {
	  setInterval(function() { this.tick(); }.bind(this), 1);
  }

  render() {
	let roomLink = "/rooms/" + this.state.currentRoom;
  let isCreate = this.props.isCreate;
  let isRoom = this.props.isRoom;
  let link = null;
  if (this.props.currentRoom) {
    link = <Link className="nav-link" to={roomLink}> Room: {this.props.currentRoom.name}</Link>;
  } else {
    link = <Link className="nav-link" to={roomLink}> Room: loading</Link>
  }

    return (
        <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark">

		  <Link to="/" className="navbar-brand">eden</Link>
          
        
          <div className="collapse navbar-collapse" id="navbarNav">

            <ul className="navbar-nav mr-auto">
              <li className={ "nav-item  " + (isRoom ? 'active' : '')}>
				        { link }
              </li>
			  <li className={ "nav-item  " + (isCreate ? 'active' : '')}>
				 <Link to="/" className="nav-link">Get a Room</Link>
			  </li>
            </ul>
			<div className="my-2 my-lg-0 white">
				<p className="date"> {this.state.date} </p>
				<p className="dateTimeSeperator">/</p>
				<p className="time"> {this.state.time} </p>
			</div>
          </div>
        </nav>
    )
  }
}

export default Nav;