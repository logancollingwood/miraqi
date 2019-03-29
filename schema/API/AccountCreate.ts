import {MiraqiError} from "../Error";
import {MiraqiUser} from "../MiraqiUser";

export interface AccountCreateRequest {
    email: String,
    password: String
}

export interface AccountCreateResponse { 
    error: MiraqiError,
    user: MiraqiUser
}