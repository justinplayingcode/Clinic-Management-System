import mongoose from "mongoose";
import PatientService from "../patient/patient.service";
import ScheduleService from "./schedule.service";
import validateReqBody from "../../common/utils/request.utils";
import { CreateScheduleRequestFields, ICreateSchedule, StatusAppointment, adminVerifyRequestFields, doctorVerifyRequestFields } from "./schedule.model";
import ErrorObject from "../../common/model/error";
import { ApiStatus, ApiStatusCode } from "../../common/enum/apiStatusCode";
import { IBaseRespone } from "../../common/model/responese";
import Validate from "../../common/utils/validate.utils";
import { ICreatePatient } from "../patient/patient.model";
import { Role } from "../../common/enum/permission";
import UserService from "../user/user.service";
import fields from "../../common/constant/fields";
import DoctorService from "../doctor/doctor.service";

export default class ScheduleController {
  private _scheduleService;
  private _patientService;
  private _userService;
  private _doctorService;

  constructor() {
    this._scheduleService = new ScheduleService();
    this._patientService = new PatientService();
    this._userService = new UserService();
    this._doctorService = new DoctorService();
  }

  //POST
  public userCreateSchedule = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    const { accountId } = req.user;
    const verifyReq = validateReqBody(req, CreateScheduleRequestFields);
    if (!verifyReq.pass) {
      const err: any = new ErrorObject(
        verifyReq.message,
        ApiStatusCode.BadRequest,
        "ScheduleController-userCreateSchedule"
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
    let response: IBaseRespone;
    const addressArr: string[] = [];
    if(req.body.address) addressArr.push(req.body.address);
    if(req.body.commune) addressArr.push(req.body.commune);
    if(req.body.district) addressArr.push(req.body.district);
    if(req.body.city) addressArr.push(req.body.city);
    try {
      // create patient
      const newPatient: ICreatePatient = {
        fullName: req.body.fullName,
        dateOfBirth: new Date(req.body.dateOfBirth),
        address: addressArr.join(", "),
        phoneNumber: req.body.phoneNumber,
        insurance: req.body.insurance,
        gender: req.body.gender,
        guardianName: req.body.guardianName,
        guardianPhoneNumber: req.body.guardianPhoneNumber,
        guardianRelationship: req.body.relationship,
      }
      const patient = await this._patientService.create(newPatient, session);
      // create schedule
      const newSchedule: ICreateSchedule = {
        patientId: patient._id,
        accountId: accountId,
        appointmentDate: new Date(req.body.appointmentDate),
        appointmentTime: req.body.appointmentTime,
        appointmentReason: req.body.appointmentReason,
        typeAppointmentId: req.body.appointmentTypeId,
      }
      await this._scheduleService.createSchedule(newSchedule, session);
      await session.commitTransaction();
      session.endSession();
      response = {
        status: ApiStatus.succes,
        isSuccess: true,
        statusCode: ApiStatusCode.OK,
        message: "Tạo lịch hẹn thành công",
      };
      res.status(ApiStatusCode.OK).json(response);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  }

  //POST
  public getSchedule = async (req, res, next) => {
    const { accountId, role } = req.user;
    let response: IBaseRespone;
    let data;
    try {
      switch (role) {
        case Role.admin:
          data = await this._scheduleService.adminGetSchedule();
          break;
        case Role.doctor:
          const user = await this._userService.findByKey(fields.accountId, accountId);
          const doctor = await this._doctorService.findByKey(fields.userId, user._id);
          data = await this._scheduleService.doctorGetSchedule(doctor._id);
          break;
        default:
          data = await this._scheduleService.userGetSchedule(accountId);
          break;
      }
      response = {
        status: ApiStatus.succes,
        isSuccess: true,
        statusCode: ApiStatusCode.OK,
        data: data,
      };
      res.status(ApiStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  //POST
  public adminVerifySchedule = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    const verifyReq = validateReqBody(req, adminVerifyRequestFields);
    if (!verifyReq.pass) {
      const err: any = new ErrorObject(
        verifyReq.message,
        ApiStatusCode.BadRequest,
        "ScheduleController-adminVerifySchedule"
      );
      return next(err);
    }
    try {
      let updateSchedule: any;
      if (req.body.isAccept) {
        updateSchedule = {
          status: StatusAppointment.CheckedAndWaitConfirm,
          doctorId: req.body.doctorId,
          departmentId: req.body.departmentId,
          statusUpdateTime: new Date,
        }
      } else {
        updateSchedule = {
          status: StatusAppointment.Cancel,
          cancellationReason: req.body.cancellationReason || "--",
          statusUpdateTime: new Date,
        }
      }
      await this._scheduleService.updateById(req.body.id, updateSchedule, session);
      await session.commitTransaction();
      session.endSession();
      const response = {
        status: ApiStatus.succes,
        isSuccess: true,
        statusCode: ApiStatusCode.OK,
        message: "Cập nhật lịch hẹn thành công"
      };
      res.status(ApiStatusCode.OK).json(response);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  }

  //POST
  public doctorVerifySchedule = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    const verifyReq = validateReqBody(req, doctorVerifyRequestFields);
    if (!verifyReq.pass) {
      const err: any = new ErrorObject(
        verifyReq.message,
        ApiStatusCode.BadRequest,
        "ScheduleController-doctorVerifySchedule"
      );
      return next(err);
    }
    try {
      let updateSchedule: any;
      if (req.body.isAccept) {
        updateSchedule = {
          status: StatusAppointment.Confirmed,
          statusUpdateTime: new Date,
        }
      } else {
        updateSchedule = {
          status: StatusAppointment.Cancel,
          cancellationReason: req.body.cancellationReason || "--",
          statusUpdateTime: new Date,
        }
      }
      await this._scheduleService.updateById(req.body.id, updateSchedule, session);
      await session.commitTransaction();
      session.endSession();
      const response = {
        status: ApiStatus.succes,
        isSuccess: true,
        statusCode: ApiStatusCode.OK,
        message: "Cập nhật lịch hẹn thành công"
      };
      res.status(ApiStatusCode.OK).json(response);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  }
}