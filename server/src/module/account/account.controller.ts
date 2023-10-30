import mongoose from "mongoose";
import { ApiStatus, ApiStatusCode } from "../../common/enum/apiStatusCode";
import { Role } from "../../common/enum/permission";
import { IBaseRespone } from "../../common/model/responese";
import validateReqBody from "../../common/utils/request.utils";
import { LoginRequest } from "./account.model";
import AccountService from "./account.service";
import UserService from "../user/user.service";
import fields from "../../common/constant/fields";
import bcrypt from 'bcryptjs';
import jwToken from "../../helper/jwt.config";
import ErrorObject from "../../common/model/error";

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
      let _res: IBaseRespone;
        const verifyReq = validateReqBody(req, LoginRequest);
        if (!verifyReq.pass) {
          const err: any = new ErrorObject(verifyReq.message, ApiStatusCode.BadRequest, "Login verify reqbody");
          return next(err)
        }
        const account = await this._accountService.findByKey(fields.phoneNumber, req.body.phoneNumber);
        if (!account) {
          const err: any = new ErrorObject('Số điện thoại không chính xác', ApiStatusCode.BadRequest, "35-account.controller");
          err.statusCode = ApiStatusCode.BadRequest;
          return next(err)
        }
        if (bcrypt.compareSync(req.body.password, account.password)) {
          const accessToken = jwToken.createAccessToken({ userId: account.userId, role: account.role});
          _res = {
            status: ApiStatus.succes,
            isSuccess: true,
            statusCode: ApiStatusCode.OK,
            data: {
              accessToken, 
              username: account.phoneNumber,
              role: account.role
            }
          }
        } else {
          const err: any = new ErrorObject('Mật khẩu không chính xác',ApiStatusCode.BadRequest,"52-account-login-controller");
          
          return next(err)
        }
        res.status(ApiStatusCode.OK).json(_res);
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
        const err: any = new ErrorObject(verifyReq.message,ApiStatusCode.BadRequest,"69-createAccount-accountController");
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