import { BaseModel } from "../../common/model/common";

export interface MedicalRecordModel extends BaseModel {
    summary: string;
    diagnosis: string;
    healthIndicator: string;
    prescriptionId: string;
    scheduleId: string;
    serviceResult: string;
}

export interface ICreateMedicalRecord {
    summary: string;
    diagnosis: string;
    healthIndicator: string;
    prescriptionId: string;
    scheduleId: string;
    serviceResult: string;
}