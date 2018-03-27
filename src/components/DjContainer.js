import React from "react";
import ReactPlayer from "react-player";
import DjQueue from "./DjQueue";

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
    
    constructor(props) {
        super(props);
	
		this.state = {
			nowPlaying: {
				url: 'https://youtu.be/pb8vWUDEmxc'
			},
			secondsPlayed: 0,
			totalLength: 0,
			playing: false,
			marginTop: "35vh",
		}

        this.state = {
			nowPlaying: {
				url: 'https://youtu.be/pb8vWUDEmxc'
			},
			secondsPlayed: 0,
			songPlayed: 0, // the amount in seconds that the song has progressed
			songLength: 0, // the length of the song in seconds
			totalLength: 0,
			playing: false
		}

        this.socket = this.props.socket;

        const playMessage = data => {
			this.setState({
				playing: true,
				nowPlaying: {
					url: data
				}
			});
        }

        this.socket.on('PLAY_MESSAGE', function(data){
			console.log("PLAYING ");
			console.log(data);
			playMessage(data);
		});

    }

    onProgress(status) {
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
		if (this.props.loading) {
			return (
				<div className="col-md-8 youtubeContainer">
					Loading...
				</div>
			)
		}
		const timeRemainingStyle = {
			width: (this.state.songPlayed / this.state.songLength) * 100 + '%'
		}
        return (
			<div className="dj">
				<div className="row video">
					<ReactPlayer ref={(input) => { this.playerElement = input; }} 
								controls={false} 
								playing={this.state.playing}
								className="youtubeEmbed" 
								url={this.state.nowPlaying.url} 
								onProgress={this.onProgress.bind(this)} 
								onDuration={this.onDuration.bind(this)}
								onPause={this.onPause.bind(this)}
								height='50vh'
								width='100%'/>
				</div>
                <div className="row time">
					<div className="progress position-relative timeRemainingBar">
						<div className="progress-bar" role="progressbar" style={timeRemainingStyle} aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
						<small className="justify-content-center d-flex position-absolute w-100 timeRemainingText">{this.state.secondsPlayed} /  {this.state.totalLength}</small>
					</div>
                </div>
				<div className="row info">
					<div className="col-md-6 left-half no-padding queue">
						<DjQueue queue={this.state.queue} />
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
