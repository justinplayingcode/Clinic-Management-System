import { BaseModel } from "../../common/model/common";

export interface typeAppointmentModel extends BaseModel {
  displayName: string;
  cost: number;
  isActive: boolean;
}

export const typeAppointmentField = {
  displayName: "displayName",
  cost: "cost",
  isActive: "isActive",
  type: "type",
};

export const typeAppointmentRequest = [
  typeAppointmentField.displayName,
  typeAppointmentField.cost,
  typeAppointmentField.type
];

export enum TypeService {
  basic,
  other
}