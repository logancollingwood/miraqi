import React from 'react';
import moment from "moment";
import { Link } from 'react-router-dom'
import Config from "./Config.js";

const DATE_FORMAT = "MM YY";
const TIME_FORMAT = "h:mm:ss a";

class Nav extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
	    date: moment().format(DATE_FORMAT),
      time: moment().format(TIME_FORMAT),
      intervalId: -1,
      room: this.props.currentRoom,
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
    const intervalId = setInterval(this.tick.bind(this), 1000);
    console.log(`setting interval id: ${intervalId}`);
  }

  componentWillUnmount() {
    console.log(`clearing interval id: ${this.state.intervalId}`);
    clearInterval(this.state.intervalId);
  }

  render() {
    let isCreate = this.props.isCreate;
    let loginLink = Config.WEB_HOST + "login/discord";
    let logoutLink = Config.WEB_HOST + 'logout';
    const isLoggedIn = this.props.user != null;

    const authHeaderToShow = isLoggedIn ? 
        <li className="nav-item">
          <a href={logoutLink} className="nav-link">Logout</a>
        </li>
    : 
        <li className="nav-item">
          <a href={loginLink} className="nav-link"><i className="fab fa-discord" /> Login </a>
        </li>
    ;

    return (
        <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark">
		      <Link to="/" className="navbar-brand">eden</Link>
          
          <div className="collapse navbar-collapse" id="navbarNav">

            <ul className="navbar-nav mr-auto">
              { authHeaderToShow }
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