import Config from "../Config.js";
const API_BASE_URL = '/api/';

let API = {
    async getUser() {
        const response = await fetch(Config.WEB_HOST + 'user/info',
			{
				method: 'GET',
				credentials: 'include'
            });
        const json = await response.json();
        if (json.loggedIn) {
            return json.user;
        } else {
            return false;
        }
    }
}

export default API;