import { BaseModel } from "../../common/model/common";

export interface ScheduleModel extends BaseModel {
  doctorId: string;
  patientId: string;
  departmentId: string;
  accountId: string;
  appointmentDate: Date;
  appointmentHour: string;
  initialSymptom: string;
  status: number;
  typeAppointmentId: string;
  statusUpadteTime: Date;
  cancellationReason: string;
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