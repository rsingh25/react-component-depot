import axios from "axios";

// Set config defaults when creating the instance
const baseServer = axios.create({
    baseURL: 'http://localhost:8080',
});

baseServer.interceptors.request.use(
    config => {
        if (sessionStorage.getItem('jwt')) {
            config.headers['Authorization'] = `Bearer ${sessionStorage.getItem('jwt')}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export {
    baseServer
};