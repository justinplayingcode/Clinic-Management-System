import { BaseModel } from "../../common/model/common";

export interface ScheduleModel extends BaseModel {
  doctorId: string;
  patientId: string;
  departmentId: string;
  accountId: string;
  appointmentDate: Date;
  appointmentTime: string;
  appointmentReason: string;
  status: number;
  typeAppointmentId: string;
  statusUpdateTime: Date;
  cancellationReason: string;
}

export interface ICreateSchedule {
  patientId: string;
  accountId: string;
  appointmentDate: Date;
  appointmentTime: string;
  appointmentReason: string;
  typeAppointmentId: string;
}

export const CreateScheduleRequestFields = [
  "fullName",
  "gender",
  "dateOfBirth",
  "phoneNumber",
  "insurance",
  "city",
  "district",
  "commune",
  "address",
  "appointmentDate",
  "appointmentTypeId",
  "appointmentTime",
  "appointmentReason",
  "guardianName",
  "guardianPhoneNumber",
  "relationship",
]

export enum TimeFrame {
  morning,
  afternoon
}

export enum StatusAppointment {
  Checking,
  CheckedAndWaitConfirm,
  Confirmed,
  Cancel,
  Complete
}

export const adminVerifyRequestFields = [
  "id",
  "doctorId",
  "departmentId",
  "isAccept"
]

export const doctorVerifyRequestFields = [
  "id",
  "isAccept",
]