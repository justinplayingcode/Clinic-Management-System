import { BaseModel } from "../../common/model/common";

export interface typeAppointmentModel extends BaseModel {
  displayName: string;
  cost: number;
  discount: number;
  isActive: boolean;
  type: number;
}

export const typeAppointmentField = {
  displayName: "displayName",
  cost: "cost",
  discount: "discount",
  isActive: "isActive",
  type: "type",
};

export const typeAppointmentRequest = [
  typeAppointmentField.displayName,
  typeAppointmentField.cost,
  typeAppointmentField.type,
  typeAppointmentField.discount,
];

export enum TypeService {
  basic,
  other
}