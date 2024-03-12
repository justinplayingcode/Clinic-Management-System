import mongoose, { Model, Schema } from "mongoose";
import { BillModel } from "./bill.model";
import collection from "../../common/constant/collection";

const billSchema = new Schema({
  medicalRecordId: {
    type: Schema.Types.ObjectId,
    ref: collection.medicalrecord,
    required: [true, "medicalRecordId must be required"],
  },
  cost: {
    type: Number,
  },
  dateCreated: {
    type: Date,
    default: new Date
  }
});
const Bill: Model<BillModel> = mongoose.model<BillModel>(
  collection.bill,
  billSchema
);
export default Bill;
