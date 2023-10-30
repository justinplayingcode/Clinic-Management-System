import mongoose, { Model, Schema } from "mongoose";
import { PrecriptionModel } from "./prescription.model";
import collection from "../../common/constant/collection";

const precriptionSchema = new Schema({
    medicationId: {
        type: String,
        trim: true,
    },
    note: {
        type: String,
        trim: true,
    },
});

const Precription: Model<PrecriptionModel> = mongoose.model<PrecriptionModel>(collection.prescription,precriptionSchema)

export default Precription

