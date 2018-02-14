import React from "react";
import Chat from "./Chat";
import ReactPlayer from "react-player";
import io from "socket.io-client";

function secondsToString(seconds) {
	return {
		numyears: Math.floor(seconds / 31536000),
		numdays: Math.floor((seconds % 31536000) / 86400),
		numhours: Math.floor(((seconds % 31536000) % 86400) / 3600),
		numminutes: Math.floor((((seconds % 31536000) % 86400) % 3600) / 60),
		numseconds: (((seconds % 31536000) % 86400) % 3600) % 60
	}
}

class ChatRoomManager extends React.Component {

	constructor(props) {
		super(props);
		this.socket = io('localhost:8002');
		this.state = {
			messages: [],
			nowPlaying: {
				url: 'https://youtu.be/pb8vWUDEmxc'
			},
			secondsPlayed: 0,
			totalLength: 0,
			playing: true,
			marginTop: "35vh"
		}
		
		const playMessage = data => {
			this.setState({
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

	componentDidMount() {
		this.setState({
			marginTop: this.playerElement.props.height
		})
	}

	onProgress(status) {
		let secondsPlayed = secondsToString(status.playedSeconds.toFixed(0));
		let secondsPlayedString = secondsPlayed.numseconds + "s";
		if (secondsPlayed.numminutes > 0) {
			secondsPlayedString = secondsPlayed.numminutes + "m" + secondsPlayedString;
		}
		this.setState({
			secondsPlayed: secondsPlayedString
		});
	}

	onDuration(seconds) {
		let timeLeft = secondsToString(seconds.toFixed(0));
		this.setState({
			totalLength: timeLeft.numminutes + "m" + timeLeft.numseconds + "s"
		})
	}

	onPause() {
		this.setState({
			playing: true
		})
	}


    render() {		
		const nowPlayingBarStyle = {
			marginTop: this.state.marginTop
		}

        return (
			<div className="container-fluid h-100">
				<div className="row justify-content-center h-100">
					<div className="col-md-8 youtubeContainer">
						<ReactPlayer ref={(input) => { this.playerElement = input; }} 
									controls={true} 
									playing={this.state.playing}
									className="youtubeEmbed" 
									url={this.state.nowPlaying.url} 
									onProgress={this.onProgress.bind(this)} 
									onDuration={this.onDuration.bind(this)}
									onPause={this.onPause.bind(this)}
									width='100%'/>
						<div className="nowPlayingBar" style={nowPlayingBarStyle}>
							<div className="timeRemainingText"> {this.state.secondsPlayed} /  {this.state.totalLength} </div>
						</div>
					</div>
					<Chat socket={this.socket} currentRoom={this.props.currentRoom}/>
				</div>
			</div>
        );
    }
}

export default ChatRoomManager;