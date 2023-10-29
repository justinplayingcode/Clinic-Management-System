import mongoose, { Model, Schema } from "mongoose";  
import { MedicationModel } from "./medication.model";
import collection from "../../common/constant/collection";

const medicationSchema = new Schema({
    displayName: {
        type: String,
        trim: true,
        unique: true,
        require: [true, 'displayName must be required']

    },
    designation:{
      type: String,
      trim: true,
      require: [true, 'designation must be required']
    },
    usage:{
        type: String,
        trim: true,
        require: [true,'usage must be required']
    },
    price: {
        type: Number,
        require: [true,'price must be required' ]
    },
});

const Medication: Model<MedicationModel> = mongoose.model<MedicationModel>(collection.medications, medicationSchema)

export default Medication