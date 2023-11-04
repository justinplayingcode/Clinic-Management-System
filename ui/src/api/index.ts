import axios from "axios";
import api from "./axios";

const path = {
  login: '/api/auth/login',
  getInfoCurrentUser: "/auth",
  changepassword: "/auth/changepassword",
  register: "/auth/register",


  manageDepartment: ""
}

const authApi = {
  login: (reqbody: any) => axios.post(`http://localhost:5050${path.login}`, reqbody),
  getInfoCurrentUser: () => api.get(path.getInfoCurrentUser),
  changepassword: (reqbody: any) => api.put(path.changepassword, reqbody),
  register: (reqbody: any) => api.post(path.register, reqbody),

}

const departmentApi = {
  manageDepartment: (reqbody: any) => api.post(path.register, reqbody),

}




export {
  authApi,
  departmentApi
};