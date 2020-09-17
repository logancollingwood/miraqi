import { createStore } from "redux";
import * as React from 'react';
import { render } from "react-dom";
import { Provider } from "react-redux";
import reducer from './reducers/reducer';
import Home from "./views/index/Home";
import Room from "./views/room/Room";
import PageNotFound from "./views/PageNotFound";
import UserProfile from "./views/profile/UserProfile";
import AccountCreation from "./views/account/AccountCreation";
import SocketApp from "./SocketApp";
import { BrowserRouter, Route, Switch, withRouter } from 'react-router-dom';

const store = createStore(reducer);

const AppWithRouter = withRouter(() => (
	<Switch>
		<Route exact={true} path="/" component={Home}/>
		<Route path="/account/create" component={AccountCreation} />
		<SocketApp>
			<Route path="/rooms/discord/:id" component={Room}/>
			<Route path="/home" component={UserProfile} />
		</SocketApp>
		<Route path="*" component={PageNotFound} />
	</Switch>
));

render((
		<Provider store={store}>
				<BrowserRouter>
					<AppWithRouter />
				</BrowserRouter>
		</Provider>

), document.getElementById('app'));