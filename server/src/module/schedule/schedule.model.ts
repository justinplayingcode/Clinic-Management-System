import { BaseModel } from "../../common/model/common";

export interface ScheduleModel extends BaseModel {
  doctorId: string;
  patientId: string;
  departmentId: string;
  appointmentDate: Date;
  appointmentHour: string;
  approve: number;
  initialSymptom: string;
  statusAppointment: number;
  typeAppointmentId: string;
  statusUpadteTime: Date;
}

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