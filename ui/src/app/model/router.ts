export const routerString = {
  Forbidden: "/forbidden",
  Unauthorized: "/notfound",
  ServerError: "/servererror",
  login: "/login",
  home: "/home",
  histories: "/histories",
  appointment: "/appointment",
  schedule: "/schedule",
  manageaccount: "/manageaccount",
  manageaccountdoctor: "/manageaccount/doctor",
  manageaccountuser: "/manageaccount/user",
  accountdetail: "/manageaccount/user/detail",
  doctordetail: "/manageaccount/doctor/detail",
  managedepartments: "/department",
  manageservice: "/service",
  managemedication: "/medication",
}

export const mappingRouter = {
  [routerString.home]: "Tổng quát",
  [routerString.histories]: "Lịch sử khám bệnh",
  [routerString.appointment]: "Khám bệnh",
  [routerString.schedule]: "Lịch hẹn",
  [routerString.manageaccount]: "Quản lý tài khoản",
  [routerString.manageaccountdoctor]: "Bác sĩ",
  [routerString.manageaccountuser]: "Người dùng",
  [routerString.accountdetail]: "Thông tin chi tiết",
  [routerString.doctordetail]: "Thông tin chi tiết",
  [routerString.managedepartments]: "Khoa",
  [routerString.managemedication]: "Thuốc",
  [routerString.manageservice]: "Dịch vụ",

}