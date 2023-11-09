import { BaseModel } from "../../common/model/common";

export interface UserModel extends BaseModel {
  isActive: any;
  accountId: string;
  email: string;
  gender: number;
  avatar: string;
  fullName: string;
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
