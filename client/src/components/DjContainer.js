import React from "react";
import ReactPlayer from "react-player";
import {connect} from 'react-redux'
import { VolumeSlider, ControlDirection } from "react-player-controls";
import {NowPlayingAction} from '../actions/action'
import RoomInfo  from "./roomInfo/RoomInfo.js";


function secondsToString(seconds) {
	return {
		numyears: Math.floor(seconds / 31536000),
		numdays: Math.floor((seconds % 31536000) / 86400),
		numhours: Math.floor(((seconds % 31536000) % 86400) / 3600),
		numminutes: Math.floor((((seconds % 31536000) % 86400) % 3600) / 60),
		numseconds: (((seconds % 31536000) % 86400) % 3600) % 60
	}
}

const mapStateToProps = (state = {}) => {
	console.log("dj state");
	console.log(state);
	let nowPlaying = state.queue[0] ? state.queue[0] : null;
	return {
		nowPlaying: nowPlaying
	};
};

const VOLUME_LOCAL_STORAGE_KEY = "PLAYER_VOLUME";

class DjContainer extends React.Component {

	constructor(props) {
		super(props);
		let self = this;
		const {dispatch} = this.props
		
		let initialVolume = 
			localStorage.getItem(VOLUME_LOCAL_STORAGE_KEY) ? 
			localStorage.getItem(VOLUME_LOCAL_STORAGE_KEY) : 0.1;
		
		this.state = {
			nowPlaying: null,
			secondsPlayed: 0,
			songPlayed: 0, // the amount in seconds that the song has progressed
			songLength: 0, // the length of the song in seconds
			totalLength: 0,
			volume: Number.parseFloat(initialVolume),
			playing: true
		}

		this.socket = this.props.socket;

		this.socket.on('play', function (data) {
			dispatch(NowPlayingAction(data))
		});
		
		this.socket.on('no_queue', function() {
			dispatch(NowPlayingAction(null))
			self.setState({
				songPlayed: 0,
				songLength: 0,
			});
		});


		this.handleVolumeChange = function(event) {
			self.setState({
				volume: event
			})
			localStorage.setItem(VOLUME_LOCAL_STORAGE_KEY, event);
		}
	}


	getNowPlayingUrl(optionalRoom) {
		let nowPlayingUrl = null;
		const room = optionalRoom ? optionalRoom : null;
		if (room) {
			nowPlayingUrl = room.queue[0] ? room.queue[0].playUrl : null;
		}
		return nowPlayingUrl;
	}

	onProgress(status) {
		if (status.loaded !== 0) {
			let secondsPlayed = secondsToString(status.playedSeconds.toFixed(0));
			let secondsPlayedString = secondsPlayed.numseconds + "s";
			if (secondsPlayed.numminutes > 0) {
				secondsPlayedString = secondsPlayed.numminutes + "m" + secondsPlayedString;
			}
			this.setState({
				secondsPlayed: secondsPlayedString,
				songPlayed: status.playedSeconds
			});
		}
	}

	onDuration(seconds) {
		let timeLeft = secondsToString(seconds.toFixed(0));
		this.setState({
			totalLength: timeLeft.numminutes + "m" + timeLeft.numseconds + "s",
			songLength: seconds
		})
	}

	onPause() {
		console.log("caught pause event");
		this.setState({
			playing: false
		});
		this.setState({
			playing: true
		});
	}

	render() {

		const timeRemainingStyle = {
			width: this.props.nowPlaying ? (this.state.songPlayed / this.state.songLength) * 100 + '%' : 0
		}

		const playerOrNothing = this.props.nowPlaying ?
				<div className="row video">
					<ReactPlayer ref={(input) => { this.player = input; }}
								controls={false}
								playing={this.state.playing}
								className="youtubeEmbed"
								volume={this.state.volume}
								url={this.props.nowPlaying.playUrl}
								onProgress={this.onProgress.bind(this)}
								onDuration={this.onDuration.bind(this)}
								onPause={this.onPause.bind(this)}
								height='50vh'
								width='100%' />
					<div className="player-controls">
						<VolumeSlider
							direction={ControlDirection.VERTICAL}
							volume={this.state.volume}
							onVolumeChange={this.handleVolumeChange}
							isEnabled={true}
						/>
					</div>
				</div>
			: 
				<div className="row video nothing-playing">
					<div className="nothing"> n / a </div>
				</div>
			;
		let queue = this.props.room ? this.props.room.queue : null;
		return (
			<div className="dj">
				{ playerOrNothing }
				<div className="row time">
					<div className="progress position-relative timeRemainingBar">
						<div className="progress-bar" role="progressbar" style={timeRemainingStyle} aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
						<small className="justify-content-center d-flex position-absolute w-100 timeRemainingText">{this.state.secondsPlayed} /  {this.state.totalLength}</small>
					</div>
				</div>
				<RoomInfo socket={this.socket} queue={queue} />
			</div>
		);
	}
}

export default connect(mapStateToProps)(DjContainer);