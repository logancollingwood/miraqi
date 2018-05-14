import React from "react";
import { render } from "react-dom"
import Home from "./Home";
import Room from "./Room/Room.js";
import RoomCreate from "./Room/RoomCreate.js";
import Profile from "./Auth/Profile.js";
import { BrowserRouter, Route, Switch } from 'react-router-dom'


render((
	<BrowserRouter>
      	<Switch>
        	<Route exact path="/" component={Home}/>
        	<Route path="/rooms/discord/:id" component={Room}/>
			<Route path="/home" component={Profile} />
    	</Switch>
	</BrowserRouter>

), document.getElementById('app'))