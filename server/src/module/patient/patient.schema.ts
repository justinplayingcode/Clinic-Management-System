import mongoose, { Model, Schema } from "mongoose";
import { PatientModel } from "./patient.model";
import { Gender } from "../../common/enum/common";
import Convert from "../../common/utils/convert.utils";
import collection from "../../common/constant/collection";

const patientSchema = new Schema({
    fullname: {
        type: String,
        trim: true,
    },
    dateofbirth: {
        type: Date,
    },
    address: {
        type: String,
        trim: true,
    },
    insurance: {
        type: String,
        trim: true,
    },
    gender: {
        type: String,
        trim: true,
        enum: {
            values: Convert.enumToArray(Gender),
            message: "{VALUE} is not supported in gender"
        }
    },
    guardianName: {
        type: String,
        trim: true,
    },
    guardianPhone: {
        type: String,
        trim: true,
    },
    guardianRelationship: {
        type: String,
        trim: true,
    }
}); 

const Patient: Model<PatientModel> = mongoose.model<PatientModel>(collection.patient,patientSchema)

export default Patient
