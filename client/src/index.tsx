import { createStore } from "redux";
import * as React from 'react';
import { render } from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import reducer from './reducers/reducer';
import Index from "./views/index/Index.js";
import Room from "./views/room/Room.js";
import PageNotFound from "./views/PageNotFound";
import UserProfile from "./views/profile/UserProfile.js";
import AccountCreation from "./views/account/AccountCreation";
import SocketApp from "./SocketApp";

const store = createStore(reducer);

render((
		<Provider store={store}>
				<BrowserRouter>
					<Switch>
						<Route exact={true} path="/" component={Index}/>
						<SocketApp>
							<Route path="/account/create" component={AccountCreation} />
							<Route path="/rooms/discord/:id" component={Room}/>
							<Route path="/home" component={UserProfile} />
						</SocketApp>
						<Route path="*" component={PageNotFound} />
					</Switch>
				</BrowserRouter>
		</Provider>

), document.getElementById('app'));