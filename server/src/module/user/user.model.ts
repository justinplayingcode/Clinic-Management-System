import { BaseModel } from "../../common/model/common";

export interface UserModel extends BaseModel {
  accountId: string;
  email: string;
  gender: number;
  avatar: string;
  fullName: boolean;
  address: string;
  dateOfBirth: Date;
}

export interface IUserModelUpdate {
  fullName: string;
  gender: boolean;
  email: string;
  dateOfBirth: Date;
  address: string;
}

export const UpdateInfoRequest = [
  "fullName",
  "email",
  "gender",
  "address",
  "dateOfBirth",
  "city",
  "district",
  "commune"
];
