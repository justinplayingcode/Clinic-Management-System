import { ClientSession } from "mongoose";
import DoctorRepository from "./doctor.repository";
import Doctor from "./doctor.schema";
import { DoctorModel, IParamForGetAll } from "./doctor.model";
import ErrorObject from "../../common/model/error";
import { ApiStatusCode } from "../../common/enum/apiStatusCode";
import logger from "../../helper/logger.config";
import MomentTimezone from "../../helper/timezone.config";

export default class DoctorService {
  
  private _doctorRepository;

  constructor() {
    this._doctorRepository = new DoctorRepository(Doctor);
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
        const err: any = new ErrorObject("không có dữ liệu với ID đã cho", ApiStatusCode.BadRequest, "28-update Doctor Service- service");
        throw err;
      }
    return await this._doctorRepository.updateById(Id, data, session);
    } catch(error){
      throw error
    }
  }

  public deleteDoctor = async (Id:any, session: ClientSession) => {
    try {
      const TargetDoctor = (await this._doctorRepository.findById(Id)) as DoctorModel;
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
      return await this._doctorRepository.updateById(Id, UpdatedDoctor, session);
    } catch (error) {
      throw error;
    }
  }
  
  public findByKey = async (key, data) => {
    try {
      return await this._doctorRepository.findByKey(key, data);
    } catch (error) {
      logger("74-doctorservice", error?.message);
      throw error;
    }
  };

  public getAll = async (param: IParamForGetAll) => {
    const { page, pageSize, searchByColumn, searchKey, conditions } = param;
    try {
      const doctors = await this._doctorRepository.getDoctorOfStaticReport(page, pageSize, searchByColumn, searchKey, conditions);
      const result = doctors.map(doctor => {
        if (doctor.userId) {
          let { accountId, _id: userId, email, avatar, fullName, gender, address, dateOfBirth, phoneNumber  } = doctor.userId;
          return {
            doctorId: doctor._id,
            rank: doctor.rank,
            position: doctor.position,
            departmentName: doctor.departmentId.displayName,
            accountId,
            userId,
            email,
            avatar,
            fullName,
            gender,
            address,
            dateOfBirth: MomentTimezone.convertDDMMYYY(dateOfBirth),
            phoneNumber
          }
        }
      })
      return result.filter(i => i)
    } catch (error) {
      logger("getAll-doctorservice", error?.message);
      throw error;
    }
  }

  public getInfoById = async (id) => {
    try {
      const doctor = await this._doctorRepository.getInfoByDoctorId(id);
      const { accountId, _id: userId, email, avatar, fullName, gender, address, dateOfBirth, phoneNumber  } = doctor.userId;
      return {
        rank: doctor.rank,
        position: doctor.position,
        departmentName: doctor.departmentId.displayName,
        accountId,
        userId,
        email,
        avatar,
        fullName,
        gender,
        address,
        dateOfBirth: MomentTimezone.convertDDMMYYY(dateOfBirth),
        phoneNumber
      }
    } catch (error) {
      logger("getInfoById-doctorservice", error?.message);
      throw error;
    }
  }
}