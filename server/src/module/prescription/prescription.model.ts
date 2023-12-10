import { BaseModel } from "../../common/model/common";

export interface PrecriptionModel extends BaseModel {
  medications: string;
  note: string;
  cost: Number;
}

export interface ICreatePrecription {
  medications: string;
  note: string;
  cost: Number;
}
