import mongoose, { Model, Schema } from "mongoose";
import { ScheduleModel, StatusAppointment, TimeFrame } from "./schedule.model";
import collection from "../../common/constant/collection";
import Convert from "../../common/utils/convert.utils";

const scheduleSchema = new Schema({
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: collection.doctor,
  },
  patientId: {
    type: Schema.Types.ObjectId,
    ref: collection.patient,
    required: [true, "patientId must be required"],
  },
  departmentId: {
    type: Schema.Types.ObjectId,
    ref: collection.department,
  },
  accountId: {
    type: Schema.Types.ObjectId,
    ref: collection.account,
    required: [true, "accountId must be required"],
  },
  appointmentDate: {
    type: Date,
    required: [true, "appointmentDate must be required"],
  },
  appointmentTime: {
    type: Number,
    enum: {
      values: Convert.enumToArray(TimeFrame),
      message: "{VALUE} is not supported in appointmentHour",
    }
  },
  appointmentReason: {
    type: String,
    trim: true,
  },
  status: {
    type: Number,
    enum: {
      values: Convert.enumToArray(StatusAppointment),
      message: "{VALUE} is not supported in appointmentHour",
    }
  },
  typeAppointmentId: {
    type: Schema.Types.ObjectId,
    ref: collection.typeappointment,
    required: [true, "typeAppointmentId must be required"],
  },
  statusUpdateTime: {
    type: Date,
    trim: true,
  },
  cancellationReason: {
    type: String,
    trim: true,
  },
});

const Schedule: Model<ScheduleModel> = mongoose.model<ScheduleModel>(
  collection.schedule,
  scheduleSchema
);

export default Schedule;
