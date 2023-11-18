import fields from "../../common/constant/fields";
import { BaseModel } from "../../common/model/common";

export interface DepartmentModel extends BaseModel {
  displayName: string;
  isActive: boolean;
}

export const departmentField = {
  displayName: "displayName",
  isActive: "isActive"
}

export const departmentRequest = [
  departmentField.displayName,
]

export const departmentUpdateRequest = [
  fields.id,
  departmentField.displayName,
]