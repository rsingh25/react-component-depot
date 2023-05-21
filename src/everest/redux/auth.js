export const actionTypes = {
    ACCT: "ACCT",
    LOGOUT: "LOGOUT",
};


export function getAcctAxn(payload) {
    return dispatch => {
        return dispatch({ type: actionTypes.ACCT, payload });
    };
}

export function logoutAxn() {
    return dispatch => {
        return dispatch({ type: actionTypes.LOGOUT });
    };
}

//status is 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = { login: null};

export function loggedInUser (state = initialState, action) {
    switch (action.type) {
        case actionTypes.ACCT:
            return {
                ...initialState, ...action.payload
            };

        case actionTypes.LOGOUT:
            return {
                ...initialState
            };

        default:
            return { ...state };
    }
}



