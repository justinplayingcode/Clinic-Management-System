// import { PositionOfDoctor } from './../../common/enum/common';
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
import logger from "../../helper/logger.config";
import MomentTimezone from "../../helper/timezone.config";

import DoctorService from '../doctor/doctor.service';

import { StaticReportRequestFields } from "../../common/model/request";
import { IRequestGetAllOfStaticReport } from "../user/user.model";


export default class AccountController {

  private _accountService;
  private _userService;
  private _doctorService;

  constructor() {
    this._accountService = new AccountService();
    this._userService = new UserService();
    this._doctorService = new DoctorService();
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
          const accessToken = jwToken.createAccessToken({ accountId: account._id, role: account.role, phoneNumber: req.body.phoneNumber });
          _res = {
            status: ApiStatus.succes,
            isSuccess: true,
            statusCode: ApiStatusCode.OK,
            data: {
              accessToken
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
        const err: any = new ErrorObject(verifyReq.message, ApiStatusCode.BadRequest,"69-createAccount-accountController");
        return next(err)
      }
      const newAccount = {
        phoneNumber: req.body.phoneNumber,
        password: req.body.password
      }
      const _account = await this._accountService.createAccount(newAccount, role, session);
      const accessToken = jwToken.createAccessToken({ accountId: _account._id, role: _account.role, phoneNumber: _account.phoneNumber });
      await this._userService.createUser(_account._id, session);
      await session.commitTransaction();
      session.endSession();
      const _res: IBaseRespone = {
        status: ApiStatus.succes,
        isSuccess: true,
        statusCode: ApiStatusCode.OK,
        data: {
          accessToken, 
          phoneNumber: _account.phoneNumber,
          role: _account.role
        }
      }
      res.status(ApiStatusCode.OK).json(_res)
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error)
    }
  }

  public CreateDoctorAccount = (role: Role) => async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const verifyReq = validateReqBody(req, LoginRequest);
      if (!verifyReq.pass) {
        const err: any = new ErrorObject(verifyReq.message, ApiStatusCode.BadRequest,"106-createDoctorAccount-accountController");
        return next(err)
      }
      const newAccount = {
        phoneNumber: req.body.phoneNumber,
        password: req.body.password
      }
      
      const _account = await this._accountService.createAccount(newAccount, role, session);
      
      
      const newUserInformation = {
        accountId: _account._id,
        fullName: req.body.fullName,
        gender: req.body.gender,
        dateOfBirth: req.body.dateOfBirth,
        address: req.body.address
      }
     
      const accessToken = jwToken.createAccessToken({ accountId: _account._id, role: _account.role, phoneNumber: _account.phoneNumber });

      // console.log(newUserInformation);
      
      const _doctor = await this._userService.createDoctor(newUserInformation, session);
       const newDoctorInformation = {
        userId: _doctor._id,
        rank: req.body.rank,
        position: req.body.position,
        departmentId: req.body.departmentId,
      } 
      await this._doctorService.createDoctor(newDoctorInformation, session);
      await session.commitTransaction();
      session.endSession();
      const _res: IBaseRespone = {
        status: ApiStatus.succes,
        isSuccess: true,
        statusCode: ApiStatusCode.OK,
        data: {
          accessToken, 
          phoneNumber: _account.phoneNumber,
          role: _account.role
        }
      }
      res.status(ApiStatusCode.OK).json(_res)
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error)
    }
  }

  // POST
  public changePassword = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    const { accountId } = req.user;
    const verifyReq = validateReqBody(req, ["password", "newPassword"]);
    let _res: IBaseRespone;
    if (!verifyReq.pass) {
      const err: any = new ErrorObject(verifyReq.message, ApiStatusCode.BadRequest, "Changepassword verify reqbody");
      return next(err)
    }
    try {
      const account = await this._accountService.findById(accountId);
      if (!account) {
        const err: any = new ErrorObject("Không tồn tại tài khoản", ApiStatusCode.BadRequest,"106-changepassword-accountController");
        return next(err)
      } else {
        if(!bcrypt.compareSync(req.body.password, account.password)) {
          const err: any = new ErrorObject("Mật khẩu không chính xác", ApiStatusCode.BadRequest,"110-changepassword-accountController");
          return next(err)
        } else {
          bcrypt.hash(req.body.newPassword, 10, async (err, hashpw) => {
            if(err) {
              logger("116-hashpw-accountController", "Lỗi");
              return next(err);
            } else {
              await this._accountService.findByIdAndUpdate(account._id, { password: hashpw }, session );
              await session.commitTransaction();
              session.endSession();
              _res = {
                status: ApiStatus.succes,
                isSuccess: true,
                statusCode: ApiStatusCode.OK,
                message: "Cập nhật mật khẩu thành công"
              }
              res.status(ApiStatusCode.OK).json(_res);
            }
          })
        }
      }
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error)
    }
  }

  // GET
  public checkCurrentUser = async (req, res, next) => {
    const { accountId } = req.user;
    try {
      const account = await this._accountService.findById(accountId);
      let _data = { phoneNumber: null, role: null };
      if(account) {
        _data = { phoneNumber: account.phoneNumber, role: account.role }
      }
      const _res: IBaseRespone = {
        status: ApiStatus.succes,
        isSuccess: true,
        statusCode: ApiStatusCode.OK,
        data: _data
      }
      res.status(ApiStatusCode.OK).json(_res);
    } catch (error) {
      next(error)
    }
  }
  // GET
  public getCurrentInfo = async (req, res, next) => {
    const { accountId } = req.user;
    try {
      const user = await this._userService.findByKey(fields.accountId, accountId);
      let _data;
      if(user) {
        const _address: string[] = user.address ? user.address.split(",") : [];
        _data = { 
          fullName: user.fullName,
          email: user.email,
          avatar: user.avatar,
          gender: user.gender,
          dateOfBirth: user.dateOfBirth ? MomentTimezone.convertDDMMYYY(user.dateOfBirth) : undefined,
          address: _address.length ? _address[0].trim() : "",
          commune: _address.length > 1 ? _address[1].trim() : "",
          district: _address.length > 2 ? _address[2].trim() : "",
          city: _address.length > 3 ? _address[3].trim(): "",
        }
      } else {
        _data = null;
      }
      const _res: IBaseRespone = {
        status: ApiStatus.succes,
        isSuccess: true,
        statusCode: ApiStatusCode.OK,
        data: _data
      }
      res.status(ApiStatusCode.OK).json(_res);
    } catch (error) {
      next(error)
    }
  }

  //POST
  public getAllAccount = (role: Role) => async (req, res, next) => {
    const verifyReq = validateReqBody(req, StaticReportRequestFields);
    let _res: IBaseRespone;
    if (!verifyReq.pass) {
      const err: any = new ErrorObject(verifyReq.message, ApiStatusCode.BadRequest, "getAllAccount verify reqbody");
      return next(err)
    }
    try {
      const param: IRequestGetAllOfStaticReport = {
        page: req.body.page,
        pageSize: req.body.pageSize,
        searchByColumn: req.body.searchByColumn,
        searchKey: req.body.searchKey,
        role: role
      }
      const result = await this._userService.getDataOfStaticReport(param);
      _res = {
        status: ApiStatus.succes,
        isSuccess: true,
        statusCode: ApiStatusCode.OK,
        data: result
      }
      res.status(ApiStatusCode.OK).json(_res)
    } catch (error) {
      next(error)
    }
  }

  //POST
  public resetPassword = async (req, res, next) => {
    const verifyReq = validateReqBody(req, ["accountId"]);
    if (!verifyReq.pass) {
      const err: any = new ErrorObject(verifyReq.message, ApiStatusCode.BadRequest, "resetPassword verify reqbody");
      return next(err)
    }
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      bcrypt.hash("1234567", 10, async (err, hashpw) => {
        if(err) {
          logger("resetPassword-hashpw-accountController", "Lỗi");
          return next(err);
        } else {
          await this._accountService.findByIdAndUpdate(req.body.accountId, { password: hashpw }, session );
          await session.commitTransaction();
          session.endSession();
          const _res: IBaseRespone = {
            status: ApiStatus.succes,
            isSuccess: true,
            statusCode: ApiStatusCode.OK,
            message: "Cập nhật mật khẩu thành công"
          }
          res.status(ApiStatusCode.OK).json(_res);
        }
      })
    } catch (error) {
      await session.commitTransaction();
      session.endSession();
      next(error)
    }
  }
}