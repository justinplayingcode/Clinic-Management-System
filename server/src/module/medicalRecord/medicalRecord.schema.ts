import mongoose, { Model, Schema } from "mongoose";
import { MedicalRecordModel } from "./medicalRecord.model";
import collection from "../../common/constant/collection";

const medicalRecordSchema = new Schema({
    summary: {
        type: String,
        trim: true,
    },
    diagnosis:{
        type: String,
        trim: true,
    },
    healthIndicator: {
        type: String,
        trim: true,
    },
    prescriptionId: {
        type: Schema.Types.ObjectId,
        ref: collection.prescription,
    },
    scheduleId: {
        type: Schema.Types.ObjectId,
        ref: collection.schedule,
        required: [true, 'scheduleId must be required']
    },
    serviceResult: {
        type: String,
        trim: true,
    }
});
const MedicalRecord: Model<MedicalRecordModel> = mongoose.model<MedicalRecordModel> (collection.medicalrecord, medicalRecordSchema)
export default MedicalRecord