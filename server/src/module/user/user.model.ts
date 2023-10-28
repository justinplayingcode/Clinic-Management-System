import { BaseModel } from "../common/common.model";

export interface UserModel extends BaseModel {
  accountid: string;
  email: string;
  gender: number;
  avatar: string;
  fullname: boolean;
  address: string;
  dateOfBirth: Date;
}

