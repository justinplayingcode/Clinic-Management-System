import mongoose from "mongoose";
import UserService from "./user.service";
import validateReqBody from "../../common/utils/request.utils";
import ErrorObject from "../../common/model/error";
import { ApiStatus, ApiStatusCode } from "../../common/enum/apiStatusCode";
import { UpdateInfoRequest, IUserModelUpdate } from "./user.model";
import Validate from "../../common/utils/validate.utils";
import { IBaseRespone } from "../../common/model/responese";
import AccountService from "../account/account.service";

export default class UserController {
  private _userService;
  private _accountService;

  constructor() {
    this._userService = new UserService();
    this._accountService = new AccountService();
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
    if (!Validate.fullName(req.body.fullName)) {
      const err: any = new ErrorObject(
        "Tên chưa đúng định dạng",
        ApiStatusCode.BadRequest,
        "35-userController"
      );
      return next(err);
    }
    try {
      const addressArr: string[] = [];
      if(req.body.address) addressArr.push(req.body.address);
      if(req.body.commune) addressArr.push(req.body.commune);
      if(req.body.district) addressArr.push(req.body.district);
      if(req.body.city) addressArr.push(req.body.city);

      const update: IUserModelUpdate = {
        fullName: req.body.fullName,
        gender: req.body.gender,
        email: req.body.email,
        dateOfBirth: new Date(req.body.dateOfBirth),
        address: addressArr.join(", ")
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

  public getInfoById = async (req, res, next) => {
    const { id } = req.query;
    try {
      const user = await this._userService.findById(id);
      const { role } = await this._accountService.findById(user?.accountId);
      const _res: IBaseRespone = {
        status: ApiStatus.succes,
        isSuccess: true,
        statusCode: ApiStatusCode.OK,
        data: { ...user, role: role },
      };
      res.status(ApiStatusCode.OK).json(_res);
    } catch (error) {
      next(error);
    }
  }
}
