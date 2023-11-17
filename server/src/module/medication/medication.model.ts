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
  id: "id"
};

export const typeMedicationRequest = [
  MedicationField.displayName,
  MedicationField.designation,
  MedicationField.usage,
  MedicationField.price,
];

export const typeMedicationUpdateRequest = [
  MedicationField.id,
  MedicationField.displayName,
  MedicationField.designation,
  MedicationField.usage,
  MedicationField.price,
];
export interface IRequestGetAllOfStaticReport {
  page: number,
  pageSize: number,
  searchByColumn: string,
  searchKey: string,
}
