import React from "react";
import { render } from "react-dom"
import Home from "./Home";
import Room from "./Room/Room.js";
import RoomCreate from "./Room/RoomCreate.js";
import { BrowserRouter, Route, Switch } from 'react-router-dom'


render((
	<BrowserRouter>
      	<Switch>
        	<Route exact path="/" component={Home}/>
			<Route exact path="/rooms/" component={RoomCreate}/>
        	<Route path="/rooms/:id" component={Room}/> 
    	</Switch>
	</BrowserRouter>

), document.getElementById('app'))