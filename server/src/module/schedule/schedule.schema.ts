import mongoose, { Model, Schema } from "mongoose";
import { ScheduleModel } from "./schedule.model";
import collection from "../../common/constant/collection";


const scheduleSchema = new Schema({
    // doctorId: string;
    doctorId: {
        type: String,
        trim: true,
        unique: true,
        required: [true,'doctorId must be required']
    },
    // patientId: string;
    patientId: {
        type: String,
        trim: true,
        unique: true,
        required: [true,'patientId must be required']
    },
    // departmentId: string;
    departmentId: {
        type: String,
        trim: true,
        unique: true,
        required: [true,'departmentId must be required']
    },
    // appointmentDate: Date;
    appointmentDate: {
        type: Date,
        trim: true,
        require: [true,'appointmentDate must be required']
    },
    // appointmentHour: string;
    appointmentHour: {
        type: String,
        trim: true,
        require: [true,'appointmentHour must be required']
    },
    // approve: number;
    approve: {
        type: Number,
        trim: true,
        require: [true,'approve must be required']
    },
    // initialSymptom: string;
    initialSymptom: {
        type: String,
        trim: true,
        require: [true,'initialSymptom must be required']
    },
    // statusAppointment: number;
    statusAppointment: {
        type: Number,
        trim: true,
        require: [true,'statusAppointment must be required']
    },
    // typeAppointmentId: string;
    typeAppointmentId: {
        type: String,
        trim: true,
        require: [true,'typeAppointmentId must be required']
    },
    // statusUpadteTime: Date;
    statusUpadteTime: {
        type: Date,
        trim: true,
        require: [true,'statusUpadteTime must be required']
    },
});

const Schedule: Model<ScheduleModel> = mongoose.model<ScheduleModel>(collection.schedule,scheduleSchema)

export default Schedule