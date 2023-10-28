import { ObjectId } from "mongoose";

export interface BaseModel {
  _id?: ObjectId;
}