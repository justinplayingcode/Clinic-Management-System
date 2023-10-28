import { BaseModel } from "../../common/model/common";

export interface DepartmentModel extends BaseModel {
  displayName: string;
  isActive: boolean;
}