import mongoose, { Model, Schema } from "mongoose";
import { MedicalRecordModel } from "./medicalRecord.model";
import collection from "../../common/constant/collection";

const medicalRecordSchema = new Schema({
    // summary: string;
    summary: {
        type: String,
        trim: true,
    },
    // diagnosis: string;
    diagnosis:{
        type: String,
        trim: true,
    },
    // healthIndicator: string;
    healthIndicator: {
        type: String,
        trim: true,
    },
    // prescriptionId: string;
    prescriptionId: {
        type: Schema.Types.ObjectId,
        ref: collection.prescription,
        required: [true, 'prescriptionId must be required']
    },
    // scheduleId: string;
    scheduleId: {
        type: String,
        trim: true,
        unique: true,
        required: [true, 'scheduleId must be required']
    },
    // tests: string;
    tests: {
        type: String,
        trim: true,
    }
    
});

const MedicalRecord: Model<MedicalRecordModel> = mongoose.model<MedicalRecordModel> (collection.medicalrecord,medicalRecordSchema)

export default MedicalRecord