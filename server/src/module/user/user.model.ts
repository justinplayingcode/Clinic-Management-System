import { BaseModel } from "../../common/model/common";

export interface UserModel extends BaseModel {
  accountid: string;
  email: string;
  gender: number;
  avatar: string;
  fullname: boolean;
  address: string;
  dateOfBirth: Date;
}

