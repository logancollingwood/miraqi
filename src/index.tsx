import { createStore } from "redux";
import * as React from 'react';
import { render } from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import reducer from './reducers/reducer';
import Home from "./Home";
import Room from "./Room/Room.js";
import PageNotFound from "./views/PageNotFound";
import UserProfile from "./views/UserProfile.js";

const store = createStore(reducer);

render((
	<Provider store={store}>
		<BrowserRouter>
			<Switch>
				<Route exact={true} path="/" component={Home}/>
				<Route path="/rooms/discord/:id" component={Room}/>
				<Route path="/home" component={UserProfile} />
				<Route path="*" component={PageNotFound} />
			</Switch>
		</BrowserRouter>
	</Provider>

), document.getElementById('app'));