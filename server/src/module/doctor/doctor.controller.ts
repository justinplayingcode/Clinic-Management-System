import mongoose from "mongoose";
import DoctorService from "./doctor.service"
import validateReqBody from "../../common/utils/request.utils";
import { doctorField, doctorRequest } from "./doctor.model";
import ErrorObject from "../../common/model/error";
import { ApiStatus, ApiStatusCode } from "../../common/enum/apiStatusCode";
import { IBaseRespone } from "../../common/model/responese";
import AccountService from "../account/account.service";
import UserService from "../user/user.service";
import fields from "../../common/constant/fields";






export default class DoctorController{
  private _doctorService;
  private _accountService;
  private _userService;
  constructor(){
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

      const accountId = req.body._id;
      console.log(accountId);
      const user = await this._userService.findByKey(fields.accountId, accountId);
      if(user) {
        const userId = user._id;
        const doctor = await this._doctorService.findByKey(doctorField.userId, userId);
        if(doctor){
          const doctorId = doctor._id;
          await this._doctorService.updateDoctor(doctorId,updatedDoctor,session);
          await session.commitTransaction();
          session.endSession();
          const _res: IBaseRespone = {
            status: ApiStatus.succes,
            isSuccess: true,
            statusCode: ApiStatusCode.OK
          };
          res.status(ApiStatusCode.OK).json(_res);
          
        } else{ 
          const err : any = new ErrorObject(verifyReq.message, ApiStatusCode.BadRequest,"60 - update Doctor - controller");
          return next(err);
        }
      } 
      else{
        const err : any = new ErrorObject(verifyReq.message, ApiStatusCode.BadRequest,"65 - update Doctor - controller");
        return next(err);
      }
    } catch(error){
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  }

  //PUT
  public deleteDoctor = async (req,res,next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const AccountId =req.body._id;
      await this._accountService.deleteDoctorService(AccountId,session);
      const User = await this._userService.findByKey(fields.accountId,AccountId);
      const userId = User._id;
      await this._userService.deleteDoctor(userId,session);
      const Doctor = await this._doctorService.findByKey(doctorField.userId,userId);
      const doctorId = Doctor._id;
      await this._doctorService.deleteDoctor(doctorId,session);
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
}