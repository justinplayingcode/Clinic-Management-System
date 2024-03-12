import mongoose from "mongoose";
import { ApiStatus, ApiStatusCode } from "../../common/enum/apiStatusCode";
import ErrorObject from "../../common/model/error";
import { IBaseRespone } from "../../common/model/responese";
import validateReqBody from "../../common/utils/request.utils";
import medicationService from "./medication.service";
import { IRequestGetAllOfStaticReport, typeMedicationRequest, typeMedicationUpdateRequest } from "./medication.model";
import { StaticReportRequestFields } from "../../common/model/request";

export default class MedicationController {
  private _MedicationService;
  constructor() {
    this._MedicationService = new medicationService();
  }

  public CreateMedication = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const verifyReq = validateReqBody(req, typeMedicationRequest);
      if (!verifyReq.pass) {
        const err: any = new ErrorObject(
          verifyReq.message,
          ApiStatusCode.BadRequest,
          "20-createMedication- controller"
        );
        return next(err);
      }
      const newMedication = {
        displayName: req.body.displayName,
        designation: req.body.designation,
        usage: req.body.usage,
        price: req.body.price,
      };
      await this._MedicationService.createMedicationService(
        newMedication,
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

  public UpdateMedication = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const verifyReq = validateReqBody(req, typeMedicationUpdateRequest);
      if (!verifyReq.pass) {
        const err: any = new ErrorObject(
          verifyReq.message,
          ApiStatusCode.BadRequest,
          "55-updateMedication- controller"
        );
        return next(err);
      }
      const newMedication = {
        displayName: req.body.displayName,
        designation: req.body.designation,
        usage: req.body.usage,
        price: req.body.price,
      };
      const Id = req.body.id;
      await this._MedicationService.updateMedicationService(
        Id,
        newMedication,
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

  public DeleteMedication = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const Id = req.body._id;
      await this._MedicationService.delteteMedicationService(Id, session);
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
  
  public getAllMedication = async (req, res, next) => {
    const verifyReq = validateReqBody(req, StaticReportRequestFields);
    let _res: IBaseRespone;
    if (!verifyReq.pass) {
      const err: any = new ErrorObject(verifyReq.message, ApiStatusCode.BadRequest, "getAllMedication verify reqbody");
      return next(err)
    }
    try {
      const param: IRequestGetAllOfStaticReport = {
        page: req.body.page,
        pageSize: req.body.pageSize,
        searchByColumn: req.body.searchByColumn,
        searchKey: req.body.searchKey,
      }
      const result = await this._MedicationService.getDataOfStaticReport(param);
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

  public getMedicationPicker =async (req, res, next) => {
    const verifyReq = validateReqBody(req, ["searchKey"]);
    let _res: IBaseRespone;
    if (!verifyReq.pass) {
      const err: any = new ErrorObject(verifyReq.message, ApiStatusCode.BadRequest, "getMedicationPicker verify reqbody");
      return next(err)
    }
    try {
      const result = await this._MedicationService.MedicationsPicker(req.body.searchKey);
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
