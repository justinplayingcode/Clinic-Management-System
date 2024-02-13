import mongoose, { Model, Schema } from "mongoose";
import { TypeService, typeAppointmentModel } from "./typeAppointment.model";
import collection from "../../common/constant/collection";
import Convert from "../../common/utils/convert.utils";

const typeAppointmentSchema = new Schema({
  displayName: {
    type: String,
    trim: true,
    index: true,
    unique: true,
  },
  cost: {
    type: Number,
  },
  discount: {
    type: Number,
    default: 0
  },
  type: {
    type: Number,
    enum: {
      values: Convert.enumToArray(TypeService),
      message: "{VALUE} is not supported in type",
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const TypeAppointment: Model<typeAppointmentModel> =
  mongoose.model<typeAppointmentModel>(
    collection.typeappointment,
    typeAppointmentSchema
  );

export default TypeAppointment;
