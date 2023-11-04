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
  managemedication: "/managemedication",
  managedepartment: "/managedepartment",
}

export const mappingRouter = {
  [routerString.home]: "Tổng quát",
  [routerString.histories]: "Lịch sử khám bệnh",
  [routerString.appointment]: "Khám bệnh",
  [routerString.schedule]: "Lịch hẹn",
  [routerString.manageaccount]: "Quản lý tài khoản",
  [routerString.manageaccountdoctor]: "Bác sĩ",
  [routerString.manageaccountuser]: "Người dùng",
  [routerString.managemedication]: "Quản lý thuốc",
  [routerString.managedepartment]: "Quản lý khoa",
}