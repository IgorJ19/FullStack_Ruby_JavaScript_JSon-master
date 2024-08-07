import axios from "axios";

export let logInFlag;
export var loadUsers = (params, callback) => async (dispatch, getState) => {
    var config = {
        url: '/users',
        params,
        headers: {authorization: getState().appState.token}
    };

    try {
        var result = await axios.request(config);
        callback(result.data);
        logInFlag = 1;
    } catch (error) {
        console.error('Error loading users:', error);
    }
};




export var loadUser = (id, callback) => async (dispatch, getState) => {
    var config = {
        url: `/users/${id}`,
        data: {
            user: {id: id}
        },
        headers: {authorization: getState().appState.token}
    };
    try {
        var result = await axios.request(config);
        callback(result.data);
    } catch (error) {
        console.error('Error loading user:', error);
    }
};

export var saveUser = (resource, callback) => async (dispatch, getState) => {
    var config = {
        url: resource.id ? `/users/${resource.id}` : '/users',
        method: resource.id ? 'PUT' : 'POST',
        data: {
            user: resource
        },
        headers: {authorization: getState().appState.token}

    };
    try {
        var result = await axios.request(config);
        callback(result.data);
    } catch (error) {
        console.error('Error saving user:', error);
    }
};



export var deleteUser = (id, callback) => async (dispatch, getState) => {
    var config = {
        url: `/users/${id}`,
        method: 'DELETE',
        headers: {authorization: getState().appState.token},
    };
    try {
        var result = await axios.request(config);
        callback();
    } catch (error) {
        console.error('Error deleting user:', error);
    }
};
