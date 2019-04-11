import React from 'react';
import moment from "moment";
import { Link } from 'react-router-dom';
import Config from "../../Config.js";
import {connect} from 'react-redux';
import styles from "./style/Nav.module.scss";

const DATE_FORMAT = "MM YY";
const TIME_FORMAT = "h:mm:ss a";
const NAV_ID = "nav"

const mapStateToProps = (state = {}) => {
	return {
    nowPlaying: state.nowPlaying,
    user: state.user
	};
};


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

  handleScroll(event) {
    this.setState({floating: true})
  }

  render() {
    let loginLink = Config.WEB_HOST + "login/discord";
    const isLoggedIn = !(this.props.user.profile === null || this.props.user.profile === undefined);
    const authHeaderToShow = isLoggedIn ? 
        <div>
          <Link to="/home" className="nav-link">Home</Link>
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
        <nav className={"navbar fixed-top navbar-expand-lg navbar-dark " + styles.nav} id={NAV_ID}>
		      <Link to="/" className={"navbar-brand " + styles.brand_text }>miraqi</Link>
          
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
              <p className={styles.date}> {this.state.date} </p>
              <p className={styles.dateTimeSeperator}>/</p>
              <p className={styles.time}> {this.state.time} </p>
            </div>
          </div>
        </nav>
    )
  }
}

export default connect(mapStateToProps)(Nav);