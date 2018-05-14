import Request from "request-promise";
import Config from "../Config.js";
const API_BASE_URL = '/api/';
let API_OPTIONS = {
    uri: API_BASE_URL,
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true
};


let API = {
    async getUser() {
        const response = await fetch(Config.WEB_HOST + 'user/info',
			{
				method: 'GET',
				credentials: 'include',
				// mode: 'no-cors'
            });
        const user = await response.json();
        return user;
    }
}

export default API;