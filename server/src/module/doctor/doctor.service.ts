import { ClientSession } from "mongoose";
import DoctorRepository from "./doctor.repository";
import Doctor from "./doctor.schema";
import { DoctorModel } from "./doctor.model";
import ErrorObject from "../../common/model/error";
import { ApiStatusCode } from "../../common/enum/apiStatusCode";
// import Convert from "../../common/utils/convert.utils";
import logger from "../../helper/logger.config";

export default class DoctorService {
  
  private _doctorRepository;
  // private _convert;

  constructor() {
    this._doctorRepository = new DoctorRepository(Doctor);
    // this._convert = new Convert();
  }
  public createDoctor = async (data:DoctorModel, session: ClientSession) => {
    try {
      const newDoctor = {
        ...data
      };
      return await this._doctorRepository.create(newDoctor, session);
    } catch (error) {
      throw error;
    }
  };
  public updateDoctor = async (Id, data: DoctorModel,session: ClientSession) => {
    try{
      const TargetDoctor = (await this._doctorRepository.findById(Id)) as DoctorModel;
    if(!TargetDoctor) {
      const err: any = new ErrorObject("không có dữ liệu với ID đã cho",ApiStatusCode.BadRequest,"28-update Doctor Service- service");
      throw err;
    }
    return await this._doctorRepository.updateById(Id,data, session);
    } catch(error){
      throw error
    }
  }
  public deleteDoctor = async (Id:any, session: ClientSession) => {
    try {
    
      const TargetDoctor = (await this._doctorRepository.findById(
        Id
      )) as DoctorModel;
      
      if (!TargetDoctor) {
        const err: any = new ErrorObject(
          "Không có dữ liệu với ID đã cho",
          ApiStatusCode.BadRequest,
          "44-Delete Doctor- service"
        );
        throw err;
      }
      //check dk isActive = false => ko xoa nua
      if (!TargetDoctor.isActive) {
        const err: any = new ErrorObject(
          "đã xóa thành công",
          ApiStatusCode.BadRequest,
          "47-delete Doctor - service"
        );
        throw err;
      }
      let UpdatedDoctor: DoctorModel = TargetDoctor;

      UpdatedDoctor.isActive = false;

      return await this._doctorRepository.updateById(
        Id,
        UpdatedDoctor,
        session
      );
    } catch (error) {
      throw error;
    }
  }
  public findByKey = async (key, data) => {
    try {
      return await this._doctorRepository.findByKey(key, data);
    } catch (error) {
      logger("29-userservice", error?.message);
      throw error;
    }
  };
}