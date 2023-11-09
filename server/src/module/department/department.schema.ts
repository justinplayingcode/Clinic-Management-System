import mongoose, { Model, Schema } from "mongoose";
import { DepartmentModel } from "./department.model";
import collection from "../../common/constant/collection";

const departmentSchema = new Schema({
  displayName: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'displayName must be required']
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const Department: Model<DepartmentModel> = mongoose.model<DepartmentModel>(collection.department, departmentSchema);

export default Department