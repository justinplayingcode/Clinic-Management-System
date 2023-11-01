import { BaseModel } from "../../common/model/common";

export interface MedicationModel extends BaseModel {
  toObject(): unknown;
  displayName: string;
  designation: string;
  usage: string;
  price: number;
  isActive: boolean;
}

export const MedicationField = {
  displayName: "displayName",
  designation: "designation",
  usage: "usage",
  price: "price",
  isActive: "isActive",
};

export const typeMedicationRequest = [
  MedicationField.displayName,
  MedicationField.designation,
  MedicationField.usage,
  MedicationField.price,
  MedicationField.isActive,
];
