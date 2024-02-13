const message = {
  NoPermission: () => "Tài khoản của bạn không được cấp quyền!",
  invalidUserName: (value) => `${value} không phải là tên người dùng hợp lệ. Tên người dùng chỉ chứa các chữ cái và số!`,
  invalidEmail: (value) => `${value} không phải là email hợp lệ!`,
  invalidPhoneNumber: (value) => `${value} không phải là số điện thoại hợp lệ!`,
  invalidFullname: (value) =>  `${value} tên không hợp lệ!`,
  invalidIdentification: (value) => `${value} số CMND/CCCD không hợp lệ!`,
  invalidInsurance: (value) => `${value} số bảo hiểm y tế!`,
  invalidDateOfBirth: () => `Ngày sinh không hợp lệ, phải là định dạng MM/dd/YYYY`
}

export default message;