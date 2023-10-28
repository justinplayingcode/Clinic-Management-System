import { BaseModel } from "../../common/model/common";

export interface DoctorModel extends BaseModel {
  userId: string;
  departmentId: string;
  rank: number;
  position: number;
  isActive: boolean;
}