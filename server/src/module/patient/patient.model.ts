import { BaseModel } from "../../common/model/common";

export interface PatientModel extends BaseModel {
  fullName: string;
  dateOfBirth: Date;
  address: string;
  phoneNumber: string;
  insurance: string;
  gender: boolean;
  guardianName: string;
  guardianPhoneNumber: string;
  guardianRelationship: string;
}

export interface ICreatePatient {
  fullName: string;
  dateOfBirth: Date;
  address: string;
  phoneNumber: string;
  insurance: string;
  gender: boolean;
  guardianName: string;
  guardianPhoneNumber: string;
  guardianRelationship: string;
}
