import { BaseModel } from "../../common/model/common";

export interface PatientModel extends BaseModel {
    fullname: string;
    dateofbirth: Date;
    address: string;
    insurance: string;
    gender: boolean;
    guardianName: string;
    guardianPhone: string;
    guardianRelationship: string;
}