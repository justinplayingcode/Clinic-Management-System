import axios from "axios";
import api from "./axios";

const path = {
  login: '/api/auth/login',
  getCheckCurrentUser: "/auth",
  getInfoCurrentUser: "/auth/user",
  changepassword: "/auth/changepassword",
  register: "/auth/register",
  updateInfo: "/user/update", 


  manageDepartment: ""
}

const authApi = {
  login: (reqbody: any) => axios.post(`http://localhost:5050${path.login}`, reqbody),
  getCheckCurrentUser: () => api.get(path.getCheckCurrentUser),
  getInfoCurrentUser: () => api.get(path.getInfoCurrentUser),
  changepassword: (reqbody: any) => api.put(path.changepassword, reqbody),
  register: (reqbody: any) => api.post(path.register, reqbody),

}

const userApi = {
  updateInfo: (reqbody: any) => api.post(path.updateInfo, reqbody),
}

const departmentApi = {
  manageDepartment: (reqbody: any) => api.post(path.register, reqbody),
}




export {
  authApi,
  departmentApi,
  userApi
};