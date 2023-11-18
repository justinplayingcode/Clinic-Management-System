import mongoose from "mongoose";
import { ApiStatus, ApiStatusCode } from "../../common/enum/apiStatusCode";
import ErrorObject from "../../common/model/error";
import { IBaseRespone } from "../../common/model/responese";
import validateReqBody from "../../common/utils/request.utils";
import { departmentRequest } from "./department.model";
import departmentService from "./department.service";
import { StaticReportRequestFields } from "../../common/model/request";
import { IRequestGetAllOfStaticReport } from "../user/user.model";
import DoctorService from "../doctor/doctor.service";

export default class DepartmentController {
  private _DepartmentService;
  private _doctorService;
  constructor() {
    this._DepartmentService = new departmentService();
    this._doctorService = new DoctorService();
  }

  public CreateDepartment = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const verifyReq = validateReqBody(req, departmentRequest);
      if (!verifyReq.pass) {
        const err: any = new ErrorObject(
          verifyReq.message,
          ApiStatusCode.BadRequest,
          "20-creatDepartment- controller"
        );
        return next(err);
      }
      const newDepartment = {
        displayName: req.body.displayName,
      };
      await this._DepartmentService.createDepartment(newDepartment, session);
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
  public updateDepartment = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const verifyReq = validateReqBody(req, departmentRequest);
      if (!verifyReq.pass) {
        const err: any = new ErrorObject(
          verifyReq.message,
          ApiStatusCode.BadRequest,
          "54-updateDepartment- controller"
        );
        return next(err);
      }
      const newDepartment = {
        displayName: req.body.displayName,
      };
      const Id = req.body.id;
      await this._DepartmentService.updateDepartment(
        Id,
        newDepartment,
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
  public deleteDepartment = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const Id = req.body._id;
      await this._DepartmentService.delteteDepartmentService(Id, session);
      await session.commitTransaction();
      session.endSession();
      const _res: IBaseRespone = {
        status: ApiStatus.succes,
        isSuccess: true,
        statusCode: ApiStatusCode.OK,
        //khong biet co can data khong
      };
      res.status(ApiStatusCode.OK).json(_res);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  };

  public getAll = async (req, res, next) => {
    try {
      const data = await this._DepartmentService.getAll();
      const _res: IBaseRespone = {
        status: ApiStatus.succes,
        isSuccess: true,
        statusCode: ApiStatusCode.OK,
        data: data
      };
      res.status(ApiStatusCode.OK).json(_res);
    } catch (error) {
      next(error);
    }
  }

  public getDoctorInDepartment = async (req, res, next) => {
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
        conditions: { departmentId: req.body.id }
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
}
