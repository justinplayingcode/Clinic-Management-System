import mongoose, { Model, Schema } from "mongoose";  
import { MedicationModel } from "./medication.model";
import collection from "../../common/constant/collection";

const medicationSchema = new Schema({
    displayName: {
        type: String,
        trim: true,
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
});

const Medication: Model<MedicationModel> = mongoose.model<MedicationModel>(collection.medications, medicationSchema)

export default Medication