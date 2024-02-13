import mongoose from "mongoose";
import PatientService from "../patient/patient.service";
import ScheduleService from "./schedule.service";
import validateReqBody from "../../common/utils/request.utils";
import { CreateScheduleRequestFields, ICreateSchedule, StatusAppointment, adminVerifyRequestFields, completeScheduleRequest, doctorVerifyRequestFields } from "./schedule.model";
import ErrorObject from "../../common/model/error";
import { ApiStatus, ApiStatusCode } from "../../common/enum/apiStatusCode";
import { IBaseRespone } from "../../common/model/responese";
import Validate from "../../common/utils/validate.utils";
import { ICreatePatient } from "../patient/patient.model";
import { Role } from "../../common/enum/permission";
import UserService from "../user/user.service";
import fields from "../../common/constant/fields";
import DoctorService from "../doctor/doctor.service";
import PrecriptionService from "../prescription/prescription.service";
import { ICreatePrecription } from "../prescription/prescription.model";
import { ICreateMedicalRecord } from "../medicalRecord/medicalRecord.model";
import MedicalRecordService from "../medicalRecord/medicalRecord.service";
import typeAppointmentService from "../typeAppointment/typeAppointment.service";
import { ICreateBill } from "../bill/bill.model";
import BillService from "../bill/bill.service";
import { IRequestGetAllOfStaticReport } from "../user/user.model";
import MomentTimezone from "../../helper/timezone.config";

export default class ScheduleController {
  private _scheduleService: any;
  private _patientService: any;
  private _userService: any;
  private _doctorService: any;
  private _precriptionService: any;
  private _medicalRecordService: any;
  private _typeAppointmentService: any;
  private _billService: any;

  constructor() {
    this._scheduleService = new ScheduleService();
    this._patientService = new PatientService();
    this._userService = new UserService();
    this._doctorService = new DoctorService();
    this._precriptionService = new PrecriptionService();
    this._medicalRecordService = new MedicalRecordService();
    this._typeAppointmentService = new typeAppointmentService();
    this._billService = new BillService();
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

  //GET
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
          data = await this._scheduleService.doctorGetSchedule({ doctorId: doctor._id });
          break;
        default:
          data = await this._scheduleService.userGetSchedule({ accountId });
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
      const response: IBaseRespone = {
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

  public completeSchedule = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    const verifyReq = validateReqBody(req, completeScheduleRequest);
    if (!verifyReq.pass) {
      const err: any = new ErrorObject(
        verifyReq.message,
        ApiStatusCode.BadRequest,
        "ScheduleController-doctorVerifySchedule"
      );
      return next(err);
    }
    try {
      // update schedule
      await this._scheduleService.completeSchedule(req.body.id, session);
      //create prescription
      const medicationInRequest = req.body.medication;
      const priceNewPrecription = Array.from(medicationInRequest?.list).reduce((acc, cur: any) => acc + cur?.price, 0);
      const newPrecription: ICreatePrecription = {
        medications: JSON.stringify(medicationInRequest?.list),
        note: medicationInRequest?.note || "",
        cost: Number(priceNewPrecription) || 0
      }
      const precription = await this._precriptionService.createNewPrecription(newPrecription, session);
      // create medicalrecord
      const newMedicalrecord: ICreateMedicalRecord = {
        summary: req.body.summary,
        diagnosis: req.body.diagnose,
        healthIndicator: JSON.stringify(req.body.indicator),
        prescriptionId: precription._id,
        scheduleId: req.body.id,
        serviceResult: JSON.stringify(req.body.services),
      }
      const medicalrecord = await this._medicalRecordService.createMedicalRecord(newMedicalrecord, session);
      // create bill
      const typeAppointment = await this._typeAppointmentService.findById(req.body.typeAppointmentId);
      const priceService = Array.from(req.body.services).reduce((acc, cur: any) => acc + cur?.price, 0);
      const _discount = typeAppointment?.discount || 0;
      const newBill: ICreateBill = {
        medicalRecordId: medicalrecord._id,
        cost: (Number(typeAppointment.cost) + Number(priceService) + Number(priceNewPrecription)) * (1 - (Number(_discount) / 100))
      }
      await this._billService.createBill(newBill, session);
      await session.commitTransaction();
      session.endSession();
      const response: IBaseRespone = {
        status: ApiStatus.succes,
        isSuccess: true,
        statusCode: ApiStatusCode.OK,
        message: "Cập nhật lịch hẹn thành công",
      };
      res.status(ApiStatusCode.OK).json(response);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  }

  public getAllCompleteSchedule = async (req, res, next) => {
    const { accountId, role } = req.user;
    let response: IBaseRespone;
    let data, param: IRequestGetAllOfStaticReport;
    try {
      switch (role) {
        case Role.admin:
          param = {
            page: req.body.page,
            pageSize: req.body.pageSize,
            searchByColumn: req.body.searchByColumn,
            searchKey: req.body.searchKey,
          }
          break;
        case Role.doctor:
          const user = await this._userService.findByKey(fields.accountId, accountId);
          const doctor = await this._doctorService.findByKey(fields.userId, user._id);
          param = {
            page: req.body.page,
            pageSize: req.body.pageSize,
            searchByColumn: req.body.searchByColumn,
            searchKey: req.body.searchKey,
            conditions: { doctorId: doctor._id }
          }
          break;
        default:
          param = {
            page: req.body.page,
            pageSize: req.body.pageSize,
            searchByColumn: req.body.searchByColumn,
            searchKey: req.body.searchKey,
            conditions: { accountId }
          }
          break;
      }
      data = await this._scheduleService.getCompleteSchedule(param);
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

  public getDetailCompleteSchedule = async (req, res, next) => {
    try {
      const schedule = await this._scheduleService.getDetailById(req.query.id);
      const doctor = await this._doctorService.getInfoById(schedule.doctorId);
      const medicalRecord = await this._medicalRecordService.getInfoByScheduleId(schedule._id);
      const prescription = await this._precriptionService.getInfoById(medicalRecord.prescriptionId);
      const bill = await this._billService.getInfoByMedicalId(medicalRecord._id);

      const _res = {
        status: ApiStatus.succes,
        isSuccess: true,
        statusCode: ApiStatusCode.OK,
        data: {
          ...schedule,
          doctor,
          medicalRecord : {
            summary: medicalRecord.summary,
            diagnosis: medicalRecord.diagnosis,
            healthIndicator: JSON.parse(medicalRecord.healthIndicator),
            serviceResult: JSON.parse(medicalRecord.serviceResult),
          },
          prescription: {
            medications: JSON.parse(prescription.medications),
            note: prescription.note
          },
          bill: {
            cost: bill.cost,
            dateCreated: MomentTimezone.convertDDMMYYY(bill.dateCreated)
          }
        },
      }
      res.status(ApiStatusCode.OK).json(_res)
    } catch (error) {
      next(error)
    }
  }
}