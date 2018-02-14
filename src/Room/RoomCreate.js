import React, { Component } from "react";
import ChatRoomManager from "../components/ChatRoomManager";
import Nav from "../Nav.js";



class RoomCreate extends Component {

  state = {
    backgroundColorHex: "#000000",
    colorPopupOpen: false,
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
		<div>
	    	<Nav isHome={false} isCreate={true}/>
				<div className="container-fluid h-100">
					<div className="row justify-content-center h-100">
						<div className="col-md-2 col-md-offset-5">
								<div className="container">

								<div className="card card-container">
									<img id="profile-img" className="profile-img-card" src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" />
									<p id="profile-name" className="profile-name-card"></p>
									<form className="form-signin">
										<span id="reauth-email" className="reauth-email"></span>
										<input type="email" id="inputEmail" className="form-control" placeholder="Email address" required autoFocus />
										<input type="password" id="inputPassword" className="form-control" placeholder="Password" autoFocus />									

										<button className="btn btn-lg btn-primary btn-block btn-signin" type="submit">Sign in</button>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
    );
  }
}

export default RoomCreate;
