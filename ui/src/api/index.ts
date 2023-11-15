import axios from "axios";
import api from "./axios";

const path = {
  login: '/api/auth/login',
  getCheckCurrentUser: "/auth",
  getInfoCurrentUser: "/auth/user",
  changepassword: "/auth/changepassword",
  register: "/auth/register",
  registerDoctor: "/doctor/register",

  updateInfo: "/user/update", 
  getAllDoctor: "/doctor",
  getDoctorInfo: "doctor/detail",
  getAllUser: "/user/getall",

  manageDepartment: "",
  getDepartment: "/department",

  getAllMedications: "/medication/getall",
}

const authApi = {
  login: (reqbody: any) => axios.post(`http://localhost:5050${path.login}`, reqbody),
  getCheckCurrentUser: () => api.get(path.getCheckCurrentUser),
  getInfoCurrentUser: () => api.get(path.getInfoCurrentUser),
  changepassword: (reqbody: any) => api.put(path.changepassword, reqbody),
  register: (reqbody: any) => api.post(path.register, reqbody),
  registerDoctor: (reqbody: any) => api.post(path.registerDoctor, reqbody),
}

const userApi = {
  updateInfo: (reqbody: any) => api.post(path.updateInfo, reqbody),
  manageUser: (reqbody: any) => api.post(path.getAllUser, reqbody),
  manageDoctor: (reqbody: any) => api.post(path.getAllDoctor, reqbody),
  doctorInfo: (query: string) => api.get(`${path.getDoctorInfo}?id=${query}`),
  accoutInfo: (query: string) => api.get(`${path.getDoctorInfo}?id=${query}`),
}

const departmentApi = {
  getDepartmentList: () => api.get(path.getDepartment),
  manageDepartment: (reqbody: any) => api.post(path.register, reqbody),
}

const medicationApi = {
  getAll: (reqbody: any) => api.post(path.getAllMedications, reqbody),
}



export {
  authApi,
  departmentApi,
  userApi,
  medicationApi
};