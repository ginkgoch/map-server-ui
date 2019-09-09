import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000';

export class Requests {
    static get baseURL() {
        return axios.defaults.baseURL;
    }

    static set baseURL(url) {
        axios.defaults.baseURL = url;
    }

    static async get(url, params)  {
        const response = await axios.get(url, { params: params || {} });
        return response;
    }

    static async post(url, data, headers) {
        const response = await axios.post(url, data, { headers: this._defaultHeaders(headers) });
        return response;
    }

    static async delete(url, params) {
        const response = await axios.delete(url, { params: params || {} });
        return  response;
    }

    static async put(url, data, headers) {
        const response = await axios.put(url, data, { headers: this._defaultHeaders(headers) });
        return response;
    }

    static _defaultHeaders(headers) {
        const defaultHeaders = { 'Content-Type': 'text/plain' };
        return headers ? { ...defaultHeaders, headers } : defaultHeaders;
    }
}