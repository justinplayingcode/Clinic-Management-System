import mongoose, { Model, Schema } from "mongoose";
import { typeAppointmentModel } from "./typeAppointment.model";
import collection from "../../common/constant/collection";

const typeAppointmentSchema = new Schema({
    displayName: {
        type: String,
        trim: true,
        required: [true, 'displayName must be required']
    },
    cost: {
        type: Number,
        require: [true,'cost must me required']
    }
});

const TypeAppointment: Model<typeAppointmentModel> = mongoose.model<typeAppointmentModel>(collection.typeappointment,typeAppointmentSchema)

export default TypeAppointment