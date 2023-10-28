import mongoose from "mongoose";
import { ApiStatus, ApiStatusCode } from "../../common/enum/apiStatusCode";
import { Role } from "../../common/enum/permission";
import { IBaseRespone } from "../../common/model/responese";
import validateReqBody from "../../common/utils/request.utils";
import logger from "../../helper/logger.config";
import { LoginRequest } from "./account.model";
import AccountService from "./account.service";
import UserService from "../user/user.service";

export default class AccountController {

  private _accountService;
  private _userService;

  constructor() {
    this._accountService = new AccountService();
    this._userService = new UserService();
  }

  // POST 
  public Login = async (req, res, next) => {
    try {
        const verifyReq = validateReqBody(req, LoginRequest);
        if (!verifyReq.pass) {
          const err: any = new Error(verifyReq.message);
          err.statusCode = ApiStatusCode.BadRequest;
          return next(err)
        }
        res.status(ApiStatusCode.OK).json({
          message: "successful"
        })
        logger("login", "successful")
    } catch (error) {
        next(error)
    }
  }

  //POST
  public CreateAccount = (role: Role) => async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const verifyReq = validateReqBody(req, LoginRequest);
      if (!verifyReq.pass) {
        const err: any = new Error(verifyReq.message);
        err.statusCode = ApiStatusCode.BadRequest;
        return next(err)
      }
      const newAccount = {
        phoneNumber: req.body.phoneNumber,
        password: req.body.password
      }
      const _account = await this._accountService.createAccount(newAccount, role, session);
      await this._userService.createUser(_account._id, session);
      await session.commitTransaction();
      session.endSession();
      const _res: IBaseRespone = {
        status: ApiStatus.succes,
        isSuccess: true,
        statusCode: ApiStatusCode.OK
      }
      res.status(ApiStatusCode.OK).json(_res)
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error)
    }
  }
}