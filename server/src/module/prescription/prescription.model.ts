import { BaseModel } from "../../common/model/common";

export interface PrecriptionModel extends BaseModel {
  medicationId: string;
  note: string;
}
