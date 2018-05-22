import React from "react";
import { render } from "react-dom"
import Home from "./Home";
import Room from "./Room/Room.js";
import RoomCreate from "./Room/RoomCreate.js";
import UserProfile from "./views/UserProfile.js";
import PageNotFound from "./views/PageNotFound";
import { BrowserRouter, Route, Switch } from 'react-router-dom'


render((
	<BrowserRouter>
      	<Switch>
        	<Route exact path="/" component={Home}/>
        	<Route path="/rooms/discord/:id" component={Room}/>
			<Route path="/home" component={UserProfile} />
			<Route path="*" component={PageNotFound} />
    	</Switch>
	</BrowserRouter>

), document.getElementById('app'))