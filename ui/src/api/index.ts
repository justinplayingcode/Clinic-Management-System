import axios from "axios";
import api from "./axios";

const path = {
  login: '/api/auth/login',
  getInfoCurrentUser: "/auth",
  changepassword: "/changepassword",
}

const authApi = {
  login: (reqbody: any) => axios.post(`http://localhost:5050${path.login}`, reqbody),
  getInfoCurrentUser: () => api.get(path.getInfoCurrentUser),
  changepassword: (reqbody: any) => api.put(path.changepassword, reqbody),
}




export {
  authApi,

};