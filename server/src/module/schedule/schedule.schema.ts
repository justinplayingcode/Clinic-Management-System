import mongoose, { Model, Schema } from "mongoose";
import { ScheduleModel, StatusAppointment, TimeFrame } from "./schedule.model";
import collection from "../../common/constant/collection";
import Convert from "../../common/utils/convert.utils";

const scheduleSchema = new Schema({
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: collection.doctor,
    required: [true, "doctorId must be required"],
  },
  patientId: {
    type: Schema.Types.ObjectId,
    ref: collection.patient,
    required: [true, "patientId must be required"],
  },
  departmentId: {
    type: Schema.Types.ObjectId,
    ref: collection.department,
    required: [true, "departmentId must be required"],
  },
  accountId: {
    type: Schema.Types.ObjectId,
    ref: collection.account,
    required: [true, "accountId must be required"],
  },
  appointmentDate: {
    type: Date,
    trim: true,
  },
  appointmentHour: {
    type: Number,
    enum: {
      values: Convert.enumToArray(TimeFrame),
      message: "{VALUE} is not supported in appointmentHour",
    }
  },
  initialSymptom: {
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
  // array of typeAppoinment id
  typeAppointmentId: {
    type: String,
    trim: true,
    require: [true, "typeAppointmentId must be required"],
  },
  statusUpadteTime: {
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
