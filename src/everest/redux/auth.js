export const actionTypes = {
    AUTHENTICATED: "AUTHENTICATED",
    ACCT: "FETCHACCT",
    LOGOUT: "LOGOUT",
};

export function getAcctAxn(payload) {
    return dispatch => {
        return dispatch({ type: actionTypes.ACCT, payload });
    };
}

export function authAxn() {
    return dispatch => {
        return dispatch({ type: actionTypes.AUTHENTICATED });
    };
}

export function logoutAxn() {
    return dispatch => {
        return dispatch({ type: actionTypes.LOGOUT });
    };
}

//status is 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = { account: { login: "", firstName: "", lastName: "", authorities: [] }, isAuthenticated: false};

export function auth (state = initialState, action) {
    switch (action.type) {
        case actionTypes.AUTHENTICATED:
            return {
                ...initialState, isAuthenticated: true
            };

        case actionTypes.ACCT:
            return {
                ...initialState, account: action.payload, isAuthenticated: true
            };

        case actionTypes.LOGOUT:
            return {
                ...initialState
            };

        default:
            return { ...state };
    }
}



