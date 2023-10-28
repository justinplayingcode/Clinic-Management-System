import mongoose, { Model, Schema } from 'mongoose';
import Validate from '../../common/utils/validate.utils';
import message from '../../common/constant/message';
import Convert from '../../common/utils/convert.utils';
import collection from '../../common/constant/collection';
import { Gender } from '../../common/enum/common';
import { UserModel } from './user.model';


const userSchema = new Schema({
    accountid: {
        type: Schema.Types.ObjectId,
        ref: collection.account,
        required: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        validate: [
            {
                validator: value => Validate.email(value),
                message: props => message.invalidEmail(props.value)
            }
        ]
    },
    avatar: {
        type: String,
        trim: true,
        default: 'https://res.cloudinary.com/dipiauw0v/image/upload/v1682100699/DATN/unisex_avatar.jpg?fbclid=IwAR0rfobILbtfTZlNoWFiWmHYPH7bPMKFP0ztGnT8CVEXtvgTOEPEBgYtxY8'
    },
    fullname: {
        type: String,
        trim: true,
        validate: {
            validator: value => Validate.fullName(value),
            message: props => message.invalidFullname(props.value)
        },
    },
    gender: {
        type: Number,
        enum: {
            values: Convert.enumToArray(Gender),
            message: "{VALUE} is not supported in gender"
        }
    },
    address: {
        type: String,
        trim: true,
    },
    dateOfBirth: {
        type: Date,
    }
});

const User: Model<UserModel> = mongoose.model<UserModel>(collection.user, userSchema);

export default User;