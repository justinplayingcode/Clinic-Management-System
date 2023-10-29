import mongoose, { Model, Schema } from "mongoose";
import { BillModel } from "./bill.model";
import collection from "../../common/constant/collection";

const billSchema = new Schema({
    medicalRecordId: {
        type: String,
        unique: true,
        trim: true,
        required: [true,'medicalRecordId must be required']
    },
    cost: {
        type: Number,
        required: [true,'cost must be required']
    }
})

const Bill: Model<BillModel> = mongoose.model<BillModel>(collection.bill,billSchema)
export default Bill