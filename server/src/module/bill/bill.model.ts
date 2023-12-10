import { BaseModel } from "../../common/model/common";

export interface BillModel extends BaseModel {
  medicalRecordId: string;
  cost: number;
}

export interface ICreateBill {
  medicalRecordId: string;
  cost: number;
}
