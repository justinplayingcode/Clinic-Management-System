import { ClientSession } from "mongoose";
import User from "./user.schema";
import UserRepository from "./user.repository";
import logger from "../../helper/logger.config";

import { UserModel } from "./user.model";
import ErrorObject from "../../common/model/error";
import { ApiStatusCode } from "../../common/enum/apiStatusCode";
// import Convert from "../../common/utils/convert.utils";

import { IRequestGetAllOfStaticReport } from "./user.model";


export default class UserService {
  private _userRepository;
  // private _convert;

  constructor() {
    this._userRepository = new UserRepository(User);
    // this._convert = new Convert;
  }

  public createUser = async (accountId, session: ClientSession) => {
    try {
      const newUser = {
        accountId,
      };
      return await this._userRepository.create(newUser, session);
    } catch (error) {
      throw error;
    }
  };
  public createDoctor = async (data, session: ClientSession) => {
    try {
      const newUser = {
        ...data
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
      return await this._userRepository.findById(id);
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
      // cho nay Thang cho toi cach fix nha chu 2ruoi sang lu lam roi :))
      const currentTime = new Date().toDateString();
      const displayNameSuffix = " - đã nghỉ việc - ";
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
      updatedDoctor.fullName = `${targetUser.fullName} ${displayNameSuffix} ${currentTime}`;
      return await this._userRepository.updateById(
        doctorId,
        updatedDoctor,
        session
      );
    } catch(error){
      logger ("delete doctor- userservice",error?.message);
      }


  public getDataOfStaticReport = async (request: IRequestGetAllOfStaticReport) => {
    try {
      const accounts = await this._userRepository.getDataOfStaticReport(
        request.page,
        request.pageSize,
        request.searchByColumn,
        request.searchKey
      )
      const result: any[] = [];
      accounts.forEach(e => {
        if(e.accountId && e.accountId.role === request.role) {
          result.push({
            ...e,
            ...e.accountId,
            accountId: e.accountId._id
          })
        }
      })
      return result;
    } catch (error) {
      logger("68-userservice", error?.message);

      throw error;
    }
  }
}
