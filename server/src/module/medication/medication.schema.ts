import mongoose, { Model, Schema } from "mongoose";  
import { MedicationModel } from "./medication.model";
import collection from "../../common/constant/collection";

const medicationSchema = new Schema({
    displayName: {
        type: String,
        unique: true,
        index: true,
        trim: true
    },
    designation:{
      type: String,
      trim: true,
    },
    usage:{
        type: String,
        trim: true,
    },
    price: {
        type: Number,
    },
    isActive: {
        type: Boolean
    }
});

const Medication: Model<MedicationModel> = mongoose.model<MedicationModel>(collection.medications, medicationSchema)

export default Medication