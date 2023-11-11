import fields from "../../common/constant/fields";
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
  fields.id,
  doctorField.departmentId,
  doctorField.rank,
  doctorField.position,
]

export const createDoctorRequest = [
  fields.phoneNumber,
  fields.fullName,
  fields.email,
  fields.gender,
  fields.address,
  fields.commune,
  fields.district,
  fields.city,
  fields.dateOfBirth,
  doctorField.departmentId,
  doctorField.rank,
  doctorField.position,
]

export interface IParamForGetAll {
  page: number, 
  pageSize: number, 
  searchByColumn: string, 
  searchKey: string, 
  conditions?: Partial<DoctorModel>
}