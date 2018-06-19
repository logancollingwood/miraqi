import React from "react";
import ReactPlayer from "react-player";
import DjQueue from "./DjQueue";
import Api from "../components/Api.js";
import moment from "moment";
import { create } from "domain";
import { VolumeSlider, ControlDirection } from "react-player-controls";

function secondsToString(seconds) {
	return {
		numyears: Math.floor(seconds / 31536000),
		numdays: Math.floor((seconds % 31536000) / 86400),
		numhours: Math.floor(((seconds % 31536000) % 86400) / 3600),
		numminutes: Math.floor((((seconds % 31536000) % 86400) % 3600) / 60),
		numseconds: (((seconds % 31536000) % 86400) % 3600) % 60
	}
}

class DjContainer extends React.Component {
	playMessage = data => {
		if (data != null) {
			let nowDate = new Date();
			let queueItemStartDate = new Date(data.playTime);
			console.log(`nowDate: ${nowDate} start date ${queueItemStartDate}`);
			let dateDifference = (nowDate - queueItemStartDate) / 1000;
			if (dateDifference > data.lengthSeconds) {
				this.onEnded(true);
				return;
			}
			let secondsDifferent = dateDifference;
			console.log(`seeking to ${secondsDifferent}`);
			this.setState({
				playing: true,
				nowPlaying: {
					url: data.playUrl,
					secondsElapsed: secondsDifferent,
					totalLength: data.lengthSeconds,
				},
				seeking: true
			});
		}
	}

	constructor(props) {
		super(props);
		let self = this;

		let nowPlayingUrl = 'https://www.youtube.com/watch?v=R0rKB_bsUNg';
		const room = this.props.room ? this.props.room :  null;
		if (room) {
			nowPlayingUrl = room.queue ? room.queue[0] : null;
		}

		this.state = {
			nowPlaying: null,
			secondsPlayed: 0,
			songPlayed: 0, // the amount in seconds that the song has progressed
			songLength: 0, // the length of the song in seconds
			totalLength: 0,
			volume: 0.5,
			playing: true
		}

		this.socket = this.props.socket;

		this.socket.on('play', function (data) {
			console.log("PLAYING ");
			console.log(data);
			self.playMessage(data);
		});

		this.socket.on('nowPlaying', function(data) {
			console.log('got nowPlaying');
			console.log(data);
			self.playMessage(data);
		});
		
		this.socket.on('no_queue', function() {
			console.log('no_queue');
			self.setState({
				nowPlaying: null,
				songPlayed: 0,
				songLength: 0,
			});
		});


		this.handleVolumeChange = function(event) {
			self.setState({
				volume: event
			})
		}
	}

	/**
	 * This method handles the seeking logic for the react-player.
	 * The seeking logic is only triggered after the component is updated and if seeking has been set to true.
	 * 
	 * This is because we need to first render the player, before we can access the seekTo method on it.
	 */
	componentDidUpdate() {
		if (!(this.player === undefined || this.player === null) && this.state.seeking) {
			this.setState({
				seeking: false
			});
			let seekFraction = this.state.nowPlaying.secondsElapsed / this.state.nowPlaying.totalLength;
			console.log(`seeking to fraction ${seekFraction}`);
			this.player.seekTo(seekFraction);
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
		if (status.loaded != 0) {
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

	onEnded(isBehind) {
		let request = isBehind ? {isBehind: true} : {};
		this.socket.emit('next_track', request);
	}

	render() {

		const timeRemainingStyle = {
			width: this.state.nowPlaying ? (this.state.songPlayed / this.state.songLength) * 100 + '%' : 0
		}

		const playerOrNothing = this.state.nowPlaying ?
				<div className="row video">
					<ReactPlayer ref={(input) => { this.player = input; }}
								controls={false}
								playing={this.state.playing}
								className="youtubeEmbed"
								volume={this.state.volume}
								url={this.state.nowPlaying.url}
								onProgress={this.onProgress.bind(this)}
								onDuration={this.onDuration.bind(this)}
								onPause={this.onPause.bind(this)}
								onEnded={this.onEnded.bind(this)}
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
				<div className="row info">
					<div className="col-md-6 left-half no-padding queue">
						<DjQueue socket={this.socket} queue={queue} />
					</div>
					<div className="col-md-6">
						<div className="top-queue">
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default DjContainer;
