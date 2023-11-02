import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { ApiStatusCode } from "../app/model/enum/apiStatus";

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
    if (error.response.status === ApiStatusCode.Forbidden) {
      localStorage.clear();
      const navigate = useNavigate()
      navigate("/");
    }
    return Promise.reject(error);
  }
);

export default api;