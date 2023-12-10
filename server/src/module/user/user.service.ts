import { ClientSession } from "mongoose";
import User from "./user.schema";
import UserRepository from "./user.repository";
import logger from "../../helper/logger.config";

import { UserModel } from "./user.model";
import ErrorObject from "../../common/model/error";
import { ApiStatusCode } from "../../common/enum/apiStatusCode";
import { IRequestGetAllOfStaticReport } from "./user.model";
import MomentTimezone from "../../helper/timezone.config";

export default class UserService {
  private _userRepository;

  constructor() {
    this._userRepository = new UserRepository(User);
  }

  public createUser = async (data, session: ClientSession) => {
    try {
      const newUser = {
        ...data,
      };
      return await this._userRepository.create(newUser, session);
    } catch (error) {
      throw error;
    }
  };

  public findByKey = async (key, data) => {
    try {
      return await this._userRepository.findByKey(key, data);
    } catch (error) {
      logger("29-userservice", error?.message);
      throw error;
    }
  };

  public findById = async (id) => {
    try {
      const user = await this._userRepository.findById(id);
      const { accountId, email, avatar, fullName, gender, address, dateOfBirth, phoneNumber } = user;
      return {
        fullName,
        gender,
        email,
        avatar,
        address, 
        phoneNumber,
        dateOfBirth: MomentTimezone.convertDDMMYYY(dateOfBirth),
        accountId
      }
    } catch (error) {
      logger("38-userservice", error?.message);
      throw error;
    }
  };

  public findByIdAndUpdate = async (id, update, session: ClientSession) => {
    try {
      return await this._userRepository.updateById(id, update, session);
    } catch (error) {
      logger("47-userservice", error?.message);
      throw error;
    }
  };

  public findOneAndUpdate = async (conditions, update, session: ClientSession) => {
    try {
      return await this._userRepository.updateByKey(
        conditions,
        update,
        session
      );
    } catch (error) {
      logger("56-userservice", error?.message);
      throw error;
    }
  };

  public deleteDoctor = async (doctorId, session: ClientSession) => {
    try {
      const targetUser = (await this._userRepository.findById(doctorId)) as UserModel;
      if (!targetUser) {
        const err: any = new ErrorObject(
          "Không có dữ liệu với ID đã cho",
          ApiStatusCode.BadRequest,
          "44-Delete Doctor- userservice"
        );
        throw err;
      }
      //check dk isActive = false => ko xoa nua
      let updatedDoctor: UserModel = targetUser;
      updatedDoctor.fullName = `${targetUser.fullName} - không còn làm việc`;
      return await this._userRepository.updateById(
        doctorId,
        updatedDoctor,
        session
      );
    } catch(error){
      logger ("delete doctor- userservice", error?.message);
    }
  }

  public getDataOfStaticReport = async (request: IRequestGetAllOfStaticReport) => {
    try {
      const users = await this._userRepository.getDataOfStaticReport(
        request.page,
        request.pageSize,
        request.searchByColumn,
        request.searchKey
      )
      const total = await this._userRepository.getTotalOfStaticReport(request.searchByColumn, request.searchKey);
      const result: any[] = [];
      users.forEach(user => {
        result.push({
          ...user,
          dateOfBirth: MomentTimezone.convertDDMMYYY(user.dateOfBirth),
          role: user.accountId.role,
          accountId: user.accountId._id,
        })
      })
      return {
        values: result,
        total
      };
    } catch (error) {
      logger("getall-userservice", error?.message);
      throw error;
    }
  }
}
