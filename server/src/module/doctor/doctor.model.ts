import { BaseModel } from "../../common/model/common";

export interface DoctorModel extends BaseModel {
  userId: string;
  departmentId: string;
  rank: number;
  position: number;
  isActive: boolean;
}
export const doctorField = {
  departmentId: "departmentId",
  userId: "userId",
  rank: "rank",
  position: "position",
  isActive: "isActive"
}

export const doctorRequest = [
  doctorField.departmentId,
  doctorField.rank,
  doctorField.position,
]