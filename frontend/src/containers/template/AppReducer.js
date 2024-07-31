import {LOGOUT} from "./AppTemplateActions";
import {LOGIN} from "../login/LoginPageActions";

const initialState = {
    token: null,
    authenticated: false,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case LOGOUT:
            return {...initialState};
        case LOGIN:
            return {
                ...state,
                token: action.token,
                authenticated: true
            };
        default:
            return state
    }
}
