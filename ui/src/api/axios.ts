import axios from "axios";
import { ApiStatusCode } from "../app/model/enum/apiStatus";
import { routerString } from "../app/model/router";

const api = axios.create({
    baseURL: 'http://localhost:5050/api/'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use((response) => {
  if(response.data) {
    return response.data;
  }
  return response
}, async (error) => {
    const status = await error.response?.status;
      if (status === ApiStatusCode.Forbidden) {
        window.open(`/#/${routerString.Forbidden}`, "_self")
      }
    return Promise.reject(error);
  }
);

export default api;