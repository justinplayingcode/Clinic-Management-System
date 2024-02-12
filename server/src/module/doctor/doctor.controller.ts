import mongoose from "mongoose";
import DoctorService from "./doctor.service"
import validateReqBody from "../../common/utils/request.utils";
import { createDoctorRequest, doctorField, doctorRequest } from "./doctor.model";
import ErrorObject from "../../common/model/error";
import { ApiStatus, ApiStatusCode } from "../../common/enum/apiStatusCode";
import { IBaseRespone } from "../../common/model/responese";
import AccountService from "../account/account.service";
import UserService from "../user/user.service";
import fields from "../../common/constant/fields";
import { Role } from "../../common/enum/permission";
import Validate from "../../common/utils/validate.utils";
import { StaticReportRequestFields } from "../../common/model/request";
import { IRequestGetAllOfStaticReport } from "../user/user.model";

export default class DoctorController {
  private _doctorService;
  private _accountService;
  private _userService;
  constructor() {
    this._doctorService = new DoctorService();
    this._accountService = new AccountService();
    this._userService = new UserService();
  }
  public UpdateDoctor = async (req,res,next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const verifyReq = validateReqBody(req, doctorRequest);
      if(!verifyReq.pass) {
        const err : any = new ErrorObject(verifyReq.message, ApiStatusCode.BadRequest,"21 - update Doctor - controller");
        return next(err);
      }
      const updatedDoctor = {
        rank: req.body.rank,
        position: req.body.position,
        departmentId: req.body.departmentId
      }
      const doctor = await this._doctorService.findById(req.body.id);
      if(doctor) {
        const doctorId = doctor._id;
        await this._doctorService.updateDoctor(doctorId, updatedDoctor, session);
        await session.commitTransaction();
        session.endSession();
        const _res: IBaseRespone = {
          status: ApiStatus.succes,
          isSuccess: true,
          statusCode: ApiStatusCode.OK
        };
        res.status(ApiStatusCode.OK).json(_res);
      } else { 
        const err : any = new ErrorObject("Không tồn tại bác sĩ", ApiStatusCode.BadRequest, "update Doctor controller");
        return next(err);
      }
    } catch(error){
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  }

  //PUT
  public deleteDoctor = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const verifyReq = validateReqBody(req, ["accountId"]);
      if(!verifyReq.pass) {
        const err : any = new ErrorObject(verifyReq.message, ApiStatusCode.BadRequest, "deleteDoctor - doctor.controller");
        return next(err);
      }
      const AccountId = req.body.accountId;
      await this._accountService.deleteDoctorService(AccountId, session);
      //
      const User = await this._userService.findByKey(fields.accountId, AccountId);
      const userId = User._id;
      await this._userService.deleteDoctor(userId, session);
      //
      const Doctor = await this._doctorService.findByKey(doctorField.userId, userId);
      const doctorId = Doctor._id;
      await this._doctorService.deleteDoctor(doctorId, session);
      //
      await session.commitTransaction();
      session.endSession();
      const _res: IBaseRespone = {
        status: ApiStatus.succes,
        isSuccess: true,
        statusCode: ApiStatusCode.OK
      };
      res.status(ApiStatusCode.OK).json(_res);
    } catch(error){
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  }

  //POST
  public CreateAccount = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    const verifyReq = validateReqBody(req, createDoctorRequest);
    if (!verifyReq.pass) {
      const err: any = new ErrorObject(verifyReq.message, ApiStatusCode.BadRequest,"106-createDoctorAccount-accountController");
      return next(err)
    }
    if (!Validate.fullName(req.body.fullName)) {
      const err: any = new ErrorObject(
        "Tên chưa đúng định dạng",
        ApiStatusCode.BadRequest,
        "35-userController"
      );
      return next(err);
    }
    const newAccount = {
      phoneNumber: req.body.phoneNumber,
      password: "1234567"
    }
    try {
      const _account = await this._accountService.createAccount(newAccount, Role.doctor, session);
      const newUserInformation = {
        accountId: _account._id,
        fullName: req.body.fullName,
        gender: req.body.gender,
        dateOfBirth: new Date(req.body.dateOfBirth),
        address:`${req.body.address}, ${req.body.commune}, ${req.body.district}, ${req.body.city}`,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
      }
      const _doctorUser = await this._userService.createUser(newUserInformation, session);
      const newDoctorInformation = {
        userId: _doctorUser._id,
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
        message: "Tạo tài khoản cho bác sĩ thành công"
      }
      res.status(ApiStatusCode.OK).json(_res)
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error)
    }
  }

  public getAllForReport = async (req, res, next) => {
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
        searchKey: req.body.searchKey
      }
      const result = await this._doctorService.getAll(param);
      _res = {
        status: ApiStatus.succes,
        isSuccess: true,
        statusCode: ApiStatusCode.OK,
        data: result,
      }
      res.status(ApiStatusCode.OK).json(_res)
    } catch (error) {
      next(error)
    }
  }

  //GET
  public getInfoById = async (req, res, next) => {
    try {
      const data = await this._doctorService.getInfoById(req.query.id);
      const _res = {
        status: ApiStatus.succes,
        isSuccess: true,
        statusCode: ApiStatusCode.OK,
        data,
      }
      res.status(ApiStatusCode.OK).json(_res)
    } catch (error) {
      next(error)
    }
  }
}