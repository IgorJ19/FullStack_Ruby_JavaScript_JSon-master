import axios from "axios";


//api mocno połączone z controllerami, url: do jakiego adresu odnosi się operacja, method: metoda wywoływana w controllerze (czasami plus instrukcje warunkowe tak lub tak)
export var loadCertificates = (params, callback) => async (dispatch, getState) => {
    var config = {
        url: '/certificates',
        params,
        headers: {authorization: getState().appState.token}
    };
    var result = await axios.request(config);
    callback(result.data);
};

export var loadUsers = () => async (dispatch, getState) => {
    try {
        var config = {
            url: '/users',
            headers: { authorization: getState().appState.token }
        };
        var result = await axios.request(config);
        return result.data;
    } catch (error) {
        throw error;
    }
};

export var saveCertificate = (resource, callback) => async (dispatch, getState) => {
    var config = {
        url: resource.id ? `/certificates/${resource.id}` : '/certificates',
        method: resource.id ? 'PUT' : 'POST',
        data: {
            certificate: resource
        },
        headers: {authorization: getState().appState.token}
    };
    var result = await axios.request(config);
    callback(result.data);
};


export var deleteCertificate = (id, callback) => async (dispatch, getState) => {
    var config = {
        url: `/certificates/${id}`,
        method: 'DELETE',
        headers: {authorization: getState().appState.token}
    };
    var result = await axios.request(config);
    callback(result.data);
};

export var loadCertificate = (id, callback) => async (dispatch, getState) => {
    var config = {
        url: `/certificates/${id}`,
        data: {
            certificate: {id: id}
        },
        headers: {authorization: getState().appState.token}
    };
    //biblioteka axios z importu, operacja jest asynchroniczna(w skrócie opóźniona) co potwierdza await które wstrzymuje działanie
    //na czas oczekiwania odpowiedzi z serwera, result.data to ciało odpowiedzi a callback(result.data) to pobranie odpowiedzi
    var result = await axios.request(config);
    callback(result.data);
};

