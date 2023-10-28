import mongoose, { Model, Schema } from "mongoose";
import collection from "../../common/constant/collection";
import Convert from "../../common/utils/convert.utils";
import { PositionOfDoctor, RankOfDoctor } from "../../common/enum/common";
import { DoctorModel } from "./doctor.model";

const doctorSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: collection.user,
    required: true
  },
  departmentId: {
    type: Schema.Types.ObjectId,
    ref: collection.department,
    required: true
  },
  rank: {
    type: Number,
    enum: {
      values: Convert.enumToArray(RankOfDoctor),
      message: "{VALUE} is not supported in rank"
    },
    default: RankOfDoctor.none
  },
  position: {
    type: Number,
    enum: {
      values: Convert.enumToArray(PositionOfDoctor),
      message: "{VALUE} is not supported in position"
    },
    default: PositionOfDoctor.none
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const Doctor: Model<DoctorModel> = mongoose.model<DoctorModel>(collection.doctor, doctorSchema);
export default Doctor