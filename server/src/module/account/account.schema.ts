import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcryptjs';
import { Role } from "../../common/enum/permission";
import collection from "../../common/constant/collection";
import message from "../../common/constant/message";
import Convert from "../../common/utils/convert.utils";
import Validate from "../../common/utils/validate.utils";

const accountSchema = new Schema({
  username: {
      type: String, 
      unique: true,
      trim: true,
      validate: {
          validator: value => Validate.userName(value),
          message: props => message.invalidUserName(props.value)
      },
      required: [true, 'username must be required']
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
  userId: {
      type: Schema.Types.ObjectId,
      ref: collection.user,
      required: true
  },
  refreshToken: {
      type: String,
      trim: true
  },
  isActive: {
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

const Security = mongoose.model(collection.account, accountSchema);

export default Security