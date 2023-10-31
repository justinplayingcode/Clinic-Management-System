import mongoose from "mongoose";
import { ApiStatus, ApiStatusCode } from "../../common/enum/apiStatusCode";
import ErrorObject from "../../common/model/error";
import { IBaseRespone } from "../../common/model/responese";
import validateReqBody from "../../common/utils/request.utils";
import medicationService from "./medication.service";
import { typeMedicationRequest } from "./medication.model";


export default class MedicationController {
    private _MedicationService;

    constructor() {
        this._MedicationService = new medicationService();
    }

    //POST
    public CreateMedication = async (req, res, next) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const verifyReq = validateReqBody(req,typeMedicationRequest)
            if(!verifyReq.pass){
                const err: any = new ErrorObject(verifyReq.message,ApiStatusCode.BadRequest, "20-createMedication- controller");
                return next(err);
            }
            const newMedication = {
                displayName: req.body.displayName,
                designation: req.body.designation,
                usage: req.body.usage,
                price: req.body.price,
                isActive: req.body.isActive
            }
            await this._MedicationService.createMedicationService(newMedication, session)
            await session.commitTransaction();
            session.endSession();
            const _res: IBaseRespone = {
                status: ApiStatus.succes,
                isSuccess: true,
                statusCode: ApiStatusCode.OK,
                //khong biet co can data khong
            }
            res.status(ApiStatusCode.OK).json(_res)
        }
        catch(error) {
            await session.abortTransaction();
            session.endSession();
            next(error);
        }
    }
    public UpdateMedication = async (req, res, next) => {
        
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const verifyReq = validateReqBody(req,typeMedicationRequest)
            if(!verifyReq.pass){
                const err: any = new ErrorObject(verifyReq.message,ApiStatusCode.BadRequest, "55-updateMedication- controller");
                return next(err);
            }
            const newMedication = {
                displayName: req.body.displayName,
                designation: req.body.designation,
                usage: req.body.usage,
                price: req.body.price,
                isActive: req.body.isActive

            }
            const Id = req.body._id;
            
            await this._MedicationService.updateMedicationService(Id,newMedication, session)
            await session.commitTransaction();
            session.endSession();
            const _res: IBaseRespone = {
                status: ApiStatus.succes,
                isSuccess: true,
                statusCode: ApiStatusCode.OK,
                //khong biet co can data khong
            }
            res.status(ApiStatusCode.OK).json(_res)
        }
        catch(error) {
            await session.abortTransaction();
            session.endSession();
            next(error);
        }
    }
    public DeleteMedication = async (req, res, next) => {
        
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            // const verifyReq = validateReqBody(req,typeAppointmentRequest)
            // if(!verifyReq){
            //     const err: any = new ErrorObject(verifyReq.message,ApiStatusCode.BadRequest, "89-deleteMedication- controller");
            //     return next(err);
            // }
            // const newMedication = {
            //     displayName: req.body.displayName,
            //     designation: req.body.designation,
            //     usage: req.body.usage,
            //     price: req.body.price
            // }
            const Id = req.body._id;
            await this._MedicationService.delteteMedicationService(Id,session)
            await session.commitTransaction();
            session.endSession();
            const _res: IBaseRespone = {
                status: ApiStatus.succes,
                isSuccess: true,
                statusCode: ApiStatusCode.OK,
                //khong biet co can data khong
            }
            res.status(ApiStatusCode.OK).json(_res)
        }
        catch(error) {
            await session.abortTransaction();
            session.endSession();
            next(error);
        }
    }
    
}