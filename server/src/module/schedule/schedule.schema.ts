import mongoose, { Model, Schema } from "mongoose";
import { ScheduleModel } from "./schedule.model";
import collection from "../../common/constant/collection";

const scheduleSchema = new Schema({
  // doctorId: string;
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: collection.doctor,
    required: [true, "doctorId must be required"],
  },
  // patientId: string;
  patientId: {
    type: Schema.Types.ObjectId,
    ref: collection.patient,
    required: [true, "patientId must be required"],
  },
  // departmentId: string;
  departmentId: {
    type: Schema.Types.ObjectId,
    ref: collection.department,
    required: [true, "departmentId must be required"],
  },
  // appointmentDate: Date;
  appointmentDate: {
    type: Date,
    trim: true,
  },
  // appointmentHour: string;
  appointmentHour: {
    type: String,
    trim: true,
  },
  // approve: number;
  approve: {
    type: Number,
    trim: true,
  },
  // initialSymptom: string;
  initialSymptom: {
    type: String,
    trim: true,
  },
  // statusAppointment: number;
  statusAppointment: {
    type: Number,
    trim: true,
  },
  // typeAppointmentId: string;
  typeAppointmentId: {
    type: Schema.Types.ObjectId,
    ref: collection.typeappointment,
    require: [true, "typeAppointmentId must be required"],
  },
  // statusUpadteTime: Date;
  statusUpadteTime: {
    type: Date,
    trim: true,
  },
});

const Schedule: Model<ScheduleModel> = mongoose.model<ScheduleModel>(
  collection.schedule,
  scheduleSchema
);

export default Schedule;
