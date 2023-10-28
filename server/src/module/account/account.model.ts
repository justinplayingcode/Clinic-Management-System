import { BaseModel } from "../../common/model/common";

export interface AccountModel extends BaseModel {
  phonenumber: string;
  password: string;
  role: number;
  refreshtoken: string;
  isactive: boolean;
}

export interface ICreateAcountBasic {
  phonenumber: string;
  password: string;
}

export interface ILoginRequest {
  username: string;
  password: string;
}

export const LoginFields = {
  phonenumber: "phonenumber",
  password: "password"
}

export const LoginRequest = [
  LoginFields.phonenumber,
  LoginFields.password
]
