import React from 'react';
import moment from "moment";
import { Link } from 'react-router-dom'
import Config from "./Config.js";
import {connect} from 'react-redux'

const DATE_FORMAT = "MM YY";
const TIME_FORMAT = "h:mm:ss a";


const mapStateToProps = (state = {}) => {
  console.log('mapping state to nav');
  console.log(state);
	return {
		nowPlaying: state.nowPlaying
	};
};


class Nav extends React.Component {

  constructor(props) {
    super(props);
    const {dispatch} = this.props
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
        <div>
          <a href={logoutLink} className="nav-link">Logout</a>
        </div>
    : 
        <div>
          <a href={loginLink} className="nav-link"><i className="fab fa-discord" /> Login </a>
        </div>
    ;
    if (this.props.nowPlaying) {
      document.title = '.eden - ' + this.props.nowPlaying.trackName;
    } else {
      document.title = '.eden';
    }

    return (
        <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark">
		      <Link to="/" className="navbar-brand">miraqi</Link>
          
          <div className="collapse navbar-collapse" id="navbarNav">

            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                { authHeaderToShow }
              </li>
              <li className="nav-item">
                <div> <a href="https://twitter.com/miraqiapp" className="nav-link"><i className="fab fa-twitter" /> bugs? </a> </div>
              </li>
                { this.props.nowPlaying &&
                  <li className="nav-item">
                    <div> <a href={this.props.nowPlaying.playUrl} className="nav-link"><i className="fab fa-youtube" /> Now Playing: {this.props.nowPlaying.trackName} </a> </div>
                  </li>
                }
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

export default connect(mapStateToProps)(Nav);