import typeAppointmentService from "./typeAppointment.service";
import { IBaseRespone } from "../../common/model/responese";
import { ApiStatus, ApiStatusCode } from "../../common/enum/apiStatusCode";
import validateReqBody from "../../common/utils/request.utils";
import { typeAppointmentRequest } from "./typeAppointment.model";
import ErrorObject from "../../common/model/error";
import mongoose from "mongoose";

export default class TypeAppointmentController {
  private _TypeAppointmentService;

  constructor() {
    this._TypeAppointmentService = new typeAppointmentService();
  }

  public CreateTypeAppointment = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const verifyReq = validateReqBody(req, typeAppointmentRequest);
      if (!verifyReq.pass) {
        const err: any = new ErrorObject(
          verifyReq.message,
          ApiStatusCode.BadRequest,
          "23-createTypeAppointment- controller"
        );
        return next(err);
      }
      const newTypeAppointment = {
        displayName: req.body.displayName,
        cost: req.body.cost,
        type: req.body.type,
        discount: req.body.discount || 0,
      };
      await this._TypeAppointmentService.createTypeAppointmentService(newTypeAppointment, session);
      await session.commitTransaction();
      session.endSession();
      const _res: IBaseRespone = {
        status: ApiStatus.succes,
        isSuccess: true,
        statusCode: ApiStatusCode.OK,
      };
      res.status(ApiStatusCode.OK).json(_res);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  };
  public UpdateTypeAppointment = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const verifyReq = validateReqBody(req, ['id', ...typeAppointmentRequest]);
      if (!verifyReq) {
        const err: any = new ErrorObject(
          verifyReq.message,
          ApiStatusCode.BadRequest,
          "51-UpdataTypeAppointment- controller"
        );
        return next(err);
      }
      const newTypeAppointment = {
        displayName: req.body.displayName,
        cost: req.body.cost,
        type: req.body.type,
        discount: req.body.discount || 0,
      };
      const Id = req.body.id;
      await this._TypeAppointmentService.updateTypeAppointmentService(
        Id,
        newTypeAppointment,
        session
      );
      await session.commitTransaction();
      session.endSession();
      const _res: IBaseRespone = {
        status: ApiStatus.succes,
        isSuccess: true,
        statusCode: ApiStatusCode.OK,
      };
      res.status(ApiStatusCode.OK).json(_res);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  };
  public DeleteTypeAppointment = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const verifyReq = validateReqBody(req, ['id']);
      if (!verifyReq) {
        const err: any = new ErrorObject(
          verifyReq.message,
          ApiStatusCode.BadRequest,
          "DeleteTypeAppointment.controller"
        );
        return next(err);
      }
      const Id = req.body.id;
      await this._TypeAppointmentService.deleteDepartmentService(Id, session);
      await session.commitTransaction();
      session.endSession();
      const _res: IBaseRespone = {
        status: ApiStatus.succes,
        isSuccess: true,
        statusCode: ApiStatusCode.OK,
      };
      res.status(ApiStatusCode.OK).json(_res);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  };
  public getAllTypeAppointment = async (req, res, next) => {
    try {
      const result = await this._TypeAppointmentService.getAllTypeAppointmentService();
      const _res: IBaseRespone = {
        status: ApiStatus.succes,
        isSuccess: true,
        statusCode: ApiStatusCode.OK,
        data: result
      };
      res.status(ApiStatusCode.OK).json(_res);
    } catch (error) {
      next(error);
    }
  }
}
