import mongoose from "mongoose";
import { ApiStatus, ApiStatusCode } from "../../common/enum/apiStatusCode";
import ErrorObject from "../../common/model/error";
import { IBaseRespone } from "../../common/model/responese";
import validateReqBody from "../../common/utils/request.utils";
import { departmentRequest } from "./department.model";
import departmentService from "./department.service";

export default class DepartmentController {
  private _DepartmentService;
  constructor() {
    this._DepartmentService = new departmentService();
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
    // const Id = req.params.id;
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
      const Id = req.body._id;
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
        //khong biet co can data khong
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
}
