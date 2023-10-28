import mongoose, { Model, Schema } from "mongoose";
import bcrypt from 'bcryptjs';
import { Role } from "../../common/enum/permission";
import collection from "../../common/constant/collection";
import message from "../../common/constant/message";
import Convert from "../../common/utils/convert.utils";
import Validate from "../../common/utils/validate.utils";
import { AccountModel } from "./account.model";

const accountSchema = new Schema({
  phonenumber: {
      type: String, 
      unique: true,
      trim: true,
      validate: {
          validator: value => Validate.phoneNumber(value),
          message: props => message.invalidPhoneNumber(props.value)
      },
      required: [true, 'phonenumber must be required']
  },
  password: {
      type: String, 
      trim: true, 
      required: [true, 'password must be required'], 
      minlength: [6, 'password must be at least 6 characters']
  },
  role: {
      type: Number,
      trim: true, 
      required: [true, 'role must be required'],
      enum: {
          values: Convert.enumToArray(Role),
          message: "{VALUE} is not supported in role"
      }
  },
  refreshtoken: {
      type: String,
      trim: true
  },
  isactive: {
      type: Boolean,
      default: true
  }
})

accountSchema.pre('save', function(next) {
let user = this;
bcrypt.hash(user.password, 10, (error, hashPassword) => {
    if (error) {
        return next(error);
    } else {
        user.password = hashPassword;
        next();
    }
})
});

const Account: Model<AccountModel> = mongoose.model<AccountModel>(collection.account, accountSchema);

export default Account