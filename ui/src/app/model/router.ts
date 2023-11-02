export const routerString = {
  Forbidden: "/forbidden",
  Unauthorized: "/notfound",
  ServerError: "/servererror",
  login: "/login",
  home: "/home",
  histories: "/histories",
  appointment: "/appointment",
  schedule: "/schedule",
}

export const mappingRouter = {
  [routerString.home]: "Tổng quát",
  [routerString.histories]: "Lịch sử",
  [routerString.appointment]: "Khám bệnh",
  [routerString.schedule]: "Lịch hẹn",
}