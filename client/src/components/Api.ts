import Config from "../Config.js";
import { AccountCreateRequest, AccountCreateResponse } from "../../../shared/schema/API/AccountCreate";

class API {
    static async getUser() {
        const response = await fetch(Config.WEB_API_HOST + 'user/info',
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

    async createAccount(createAccountRequest: AccountCreateRequest) {
        const response = await fetch(Config.WEB_API_HOST + 'account/create', 
                                    {   method: 'POST', 
                                        body: JSON.stringify(createAccountRequest),
                                        credentials: 'include'
                                    }
                                );
                                console.log( await response);
        
        if (!response.ok) {
            throw {
                message: `Unable to initiate call to the server`,
                code: response.status
            } 
        }
        const accountCreateResponse: AccountCreateResponse = await response.json();
        if (accountCreateResponse.error) {
            throw {
                message: `Unable to create user, server responded with error code`,
                code: accountCreateResponse.error.error_code
            }
        }
    }
}

export default API;