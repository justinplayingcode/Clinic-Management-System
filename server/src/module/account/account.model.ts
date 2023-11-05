import { BaseModel } from "../../common/model/common";

export interface AccountModel extends BaseModel {
  phoneNumber: string;
  password: string;
  role: number;
  isActive: boolean;
}

export interface ICreateAcountBasic {
  phoneNumber: string;
  password: string;
}

export interface ILoginRequest {
  phoneNumber: string;
  password: string;
}

export const LoginFields = {
  phoneNumber: "phoneNumber",
  password: "password"
}

export const LoginRequest = [
  LoginFields.phoneNumber,
  LoginFields.password
]
