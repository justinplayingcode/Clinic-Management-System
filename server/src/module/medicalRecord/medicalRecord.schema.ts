import mongoose, { Model, Schema } from "mongoose";
import { MedicalRecordModel } from "./medicalRecord.model";
import collection from "../../common/constant/collection";

const medicalRecordSchema = new Schema({
    // summary: string;
    summary: {
        type: String,
        trim: true,
        required: [true, 'summary must be required']
    },
    // diagnosis: string;
    diagnosis:{
        type: String,
        trim: true,
        required: [true, 'diagnosis must be required']
    },
    // healthIndicator: string;
    healthIndicator: {
        type: String,
        trim: true,
        required: [true, 'healthIndicator must be required']
    },
    // prescriptionId: string;
    prescriptionId: {
        type: String,
        trim: true,
        unique: true,
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
        required: [true, 'tests must be required']
    }
    
});

const MedicalRecord: Model<MedicalRecordModel> = mongoose.model<MedicalRecordModel> (collection.medicalrecord,medicalRecordSchema)

export default MedicalRecord