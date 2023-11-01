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

export interface UserModelUpdate {
  email: string;
  gender: number;
  fullName: boolean;
  address: string;
  dateOfBirth: Date;
}

export const UpdateInfoRequest = [
  "fullName",
  "email",
  "gender",
  "address",
  "dateOfBirth",
];
