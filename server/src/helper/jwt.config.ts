import  jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Role } from "../common/enum/permission";

export interface IPayLoad {
  accountId: mongoose.Types.ObjectId,
  role: Role,
  phoneNumber: string
}

export default class jwToken {
    public static createAccessToken = (payload: IPayLoad) => {
        return jwt.sign(payload, process.env.APP_SECRET, {
            algorithm: "HS256",
            expiresIn: "1d",
        })
    }
    public static createRefreshToken = (payload: IPayLoad) => {
        return jwt.sign(payload, process.env.APP_REFRESH, {
            algorithm: "HS512",
            expiresIn: "3d",
        })
    }
    public static getPayloadInRefreshToken = (token) => {
        return jwt.verify(token, process.env.APP_REFRESH);
    }
    public static getPayLoadInAccessToken = (token) => {
        return jwt.verify(token, process.env.APP_SECRET);
    }
}