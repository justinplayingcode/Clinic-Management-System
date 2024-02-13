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
  from8AMto9AM,
  from9AMto10AM,
  from10AMto11AM,
  from1PMto2PM,
  from2PMto3PM,
  from3PMto4PM,
  from4PMto5PM,
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

export const completeScheduleRequest = [
  "id",
  "typeAppointmentId",
  "services",
  "summary",
  "diagnose",
  "indicator",
  "medication"
]