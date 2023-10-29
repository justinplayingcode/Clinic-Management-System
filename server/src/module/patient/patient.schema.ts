import mongoose, { Model, Schema } from "mongoose";
import { PatientModel } from "./patient.model";
import { Gender } from "../../common/enum/common";
import Convert from "../../common/utils/convert.utils";
import collection from "../../common/constant/collection";

const patientSchema = new Schema({
    fullname: {
        type: String,
        trim: true,
        require: [true, 'fullname must be required']
    },
    dateofbirth: {
        type: Date,
        require: [true, 'dateofbirth must be required']
    },
    address: {
        type: String,
        trim: true,
        require: [true, 'address must be required']
    },
    insurance: {
        type: String,
        trim: true,
        require: [true, 'insurance must be required']
    },
    gender: {
        type: String,
        trim: true,
        require: [true, 'gender must be required'],
        enum: {
            values: Convert.enumToArray(Gender),
            message: "{VALUE} is not supported in gender"
        }
    },
    guardianName: {
        type: String,
        trim: true,
        require: [true, 'guardianName must be required']
    },
    guardianPhone: {
        type: String,
        trim: true,
        require: [true, 'guardianPhone must be required']
    },
    guardianRelationship: {
        type: String,
        trim: true,
        require: [true, 'guardianRelationship must be required']
    }
}); 

const Patient: Model<PatientModel> = mongoose.model<PatientModel>(collection.patient,patientSchema)

export default Patient
