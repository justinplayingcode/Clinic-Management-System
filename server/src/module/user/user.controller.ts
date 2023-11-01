import mongoose from "mongoose";
import UserService from "./user.service";
import validateReqBody from "../../common/utils/request.utils";
import ErrorObject from "../../common/model/error";
import { ApiStatus, ApiStatusCode } from "../../common/enum/apiStatusCode";
import { UpdateInfoRequest, UserModelUpdate } from "./user.model";

export default class UserController {
  private _userService;

  constructor() {
    this._userService = new UserService();
  }

  //POST
  public updateInfo = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    const { accountId } = req.user;
    const verifyReq = validateReqBody(req, UpdateInfoRequest);
    let _res;
    if (!verifyReq.pass) {
      const err: any = new ErrorObject(
        verifyReq.message,
        ApiStatusCode.BadRequest,
        "24-userController"
      );
      return next(err);
    }
    try {
      const update: UserModelUpdate = {
        email: req.body.email,
        gender: req.body.gender,
        fullName: req.body.fullName,
        address: req.body.address,
        dateOfBirth: new Date(req.body.dateOfBirth),
      };
      await this._userService.findOneAndUpdate({ accountId }, update, session);
      await session.commitTransaction();
      session.endSession();
      _res = {
        status: ApiStatus.succes,
        isSuccess: true,
        statusCode: ApiStatusCode.OK,
        message: "Cập nhật thông tin thành công",
      };
      res.status(ApiStatusCode.OK).json(_res);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  };
}
