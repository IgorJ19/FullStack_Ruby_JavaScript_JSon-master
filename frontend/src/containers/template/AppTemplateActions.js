export const DISMISS_ALERT = 'DISMISS_ALERT';
export const LOGOUT = 'LOGOUT';

export const logout = () => {
    return {
        type: LOGOUT
    };
};

export const dismiss = alert => {
    return {
        type: DISMISS_ALERT,
        alert
    };
};

