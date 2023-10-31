import mongoose, { Model, Schema } from "mongoose";
import { typeAppointmentModel } from "./typeAppointment.model";
import collection from "../../common/constant/collection";

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
    isActive: {
        type: Boolean,
        default: true
    }
});

const TypeAppointment: Model<typeAppointmentModel> = mongoose.model<typeAppointmentModel>(collection.typeappointment,typeAppointmentSchema)

export default TypeAppointment