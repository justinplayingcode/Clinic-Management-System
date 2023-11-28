import axios from "axios";
import api from "./axios";

const path = {
  login: '/api/auth/login',
  getCheckCurrentUser: "/auth",
  getInfoCurrentUser: "/auth/user",
  changepassword: "/auth/changepassword",
  resetpassword: "/auth/resetpw",
  register: "/auth/register",
  registerDoctor: "/doctor/register",

  updateInfo: "/user/update", 
  getAllDoctor: "/doctor",
  getDoctorInfo: "/doctor/detail",
  updateDoctor: "/doctor/update",
  getAllUser: "/user/getall",
  getUserInfo: "/user/detail",

  manageDepartment: "/department/doctors",
  getDepartment: "/department",
  createDepartment: "/department/create",
  updateDepartment: "/department/update",

  getAllMedications: "/medication/getall",
  createlMedications: "/medication/create",
  updateMedications: "/medication/update",
  pickerMedications: "/medication/picker",

  getAllService: "/typeAppointment/getall",
  createService: "/typeAppointment/create",
  updateService: "/typeAppointment/update",

  userCreateSchedule: "/schedule/usercreate",
  getSchedule: "/schedule",
  adminVerify: "/schedule/adminverify",
  doctorVerify: "/schedule/doctorverify",
}

const authApi = {
  login: (reqbody: any) => axios.post(`http://localhost:5050${path.login}`, reqbody),
  getCheckCurrentUser: () => api.get(path.getCheckCurrentUser),
  getInfoCurrentUser: () => api.get(path.getInfoCurrentUser),
  changepassword: (reqbody: any) => api.post(path.changepassword, reqbody),
  resetpassword: (reqbody: any) => api.put(path.resetpassword, reqbody),
  register: (reqbody: any) => api.post(path.register, reqbody),
  registerDoctor: (reqbody: any) => api.post(path.registerDoctor, reqbody),
  updateDoctor: (reqbody: any) => api.post(path.updateDoctor, reqbody),
}

const userApi = {
  updateInfo: (reqbody: any) => api.post(path.updateInfo, reqbody),
  manageUser: (reqbody: any) => api.post(path.getAllUser, reqbody),
  manageDoctor: (reqbody: any) => api.post(path.getAllDoctor, reqbody),
  doctorInfo: (query: string) => api.get(`${path.getDoctorInfo}?id=${query}`),
  accoutInfo: (query: string) => api.get(`${path.getUserInfo}?id=${query}`),
}

const departmentApi = {
  getDepartmentList: () => api.get(path.getDepartment),
  manageDepartment: (reqbody: any) => api.post(path.manageDepartment, reqbody), // api get doctor of department
  createDepartment: (reqbody: any) => api.post(path.createDepartment, reqbody),
  updateDepartment: (reqbody: any) => api.post(path.updateDepartment, reqbody),
}

const medicationApi = {
  getAll: (reqbody: any) => api.post(path.getAllMedications, reqbody),
  createlMedications: (reqbody: any) => api.post(path.createlMedications, reqbody),
  updateMedications: (reqbody: any) => api.post(path.updateMedications, reqbody),
  pickerMedications: (reqbody: any) => api.post(path.pickerMedications, reqbody),
}

const serviceApi = {
  getAll: () => api.get(path.getAllService),
  createlService: (reqbody: any) => api.post(path.createService, reqbody),
  updateService: (reqbody: any) => api.post(path.updateService, reqbody),
}

const scheduleApi = {
  userCreateSchedule: (reqbody: any) => api.post(path.userCreateSchedule, reqbody),
  getAll: () => api.get(path.getSchedule),
  adminVerify: (reqbody: any) => api.post(path.adminVerify, reqbody),
  doctorVerify: (reqbody: any) => api.post(path.doctorVerify, reqbody),
}

export {
  authApi,
  departmentApi,
  userApi,
  medicationApi,
  serviceApi,
  scheduleApi
};