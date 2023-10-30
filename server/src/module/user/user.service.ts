import { ClientSession } from "mongoose";
import User from "./user.schema";
import UserRepository from "./user.repository";
import logger from "../../helper/logger.config";

export default class UserService {

  private _userRepository;

  constructor() {
    this._userRepository = new UserRepository(User);
  }

  public createUser = async (accountId, session: ClientSession) => {
    try {
      const newUser = {
        accountId
      }
      return await this._userRepository.create(newUser, session);
    } catch (error) {
      throw error
    }
  }

  public findByKey = async (key, data) => {
    try {
      return await this._userRepository.findByKey(key, data);
    } catch (error) {
      logger("29-userservice", error?.message);
      throw error
    }
  }

  public findById = async (id) => {
    try {
      return await this._userRepository.findById(id);
    } catch (error) {
      logger("38-userservice", error?.message);
      throw error
    }
  }

  public findByIdAndUpdate = async (id, update, session) => {
    try {
      return await this._userRepository.updateById(id, update, session);
    } catch (error) {
      logger("47-userservice", error?.message);
      throw error
    }
  }

  public findOneAndUpdate = async (conditions, update, session) => {
    try {
      return await this._userRepository.updateByKey(conditions, update, session);
    } catch (error) {
      logger("56-userservice", error?.message);
      throw error
    }
  }
}