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
	    time: moment().format(TIME_FORMAT)
    }
  }

  tick() {
	this.setState({
         date: moment().format(DATE_FORMAT),
		 time: moment().format(TIME_FORMAT)
    });
  }
  componentDidMount() {
	setInterval(function() { this.tick(); }.bind(this), 1);
  }

  render() {
	let roomLink = "/rooms/1";
  let isCreate = this.props.isCreate;
	let isRoom = this.props.isRoom;

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

		  <Link to="/" className="navbar-brand">eden</Link>
          
        
          <div className="collapse navbar-collapse" id="navbarNav">

            <ul className="navbar-nav mr-auto">
              <li className={ "nav-item  " + (isRoom ? 'active' : '')}>
				<Link className="nav-link" to={roomLink}> Room: {this.state.currentRoom}</Link>
              </li>
			  <li className={ "nav-item  " + (isCreate ? 'active' : '')}>
				 <Link to="/rooms/" className="nav-link">Get a Room</Link>
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