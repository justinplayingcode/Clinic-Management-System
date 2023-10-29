import { BaseModel } from "../../common/model/common";

export interface MedicationModel extends BaseModel {
    displayName: string;
    designation: string;
    usage: string;
    price: number;
    isActive: boolean;
}