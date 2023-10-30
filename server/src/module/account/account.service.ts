import { ClientSession } from "mongoose";
import AccountRepository from "./account.repository";
import Account from "./account.schema";
import { AccountModel, ICreateAcountBasic } from "./account.model";
import { Role } from "../../common/enum/permission";
import logger from "../../helper/logger.config";

export default class AccountService {
  
  private _accountRepository;

  constructor() {
    this._accountRepository = new AccountRepository(Account);
  }

  public createAccount = async (basic: ICreateAcountBasic, role: Role, session: ClientSession) => {
    try {
      const newAccount: AccountModel = {
        ...basic,
        role,
        isActive: true,
        refreshToken: ""
      }
      return await this._accountRepository.create(newAccount, session);
    } catch (error) {
      throw error
    }
  }

  public findByKey = async (key, data) => {
    try {
      return await this._accountRepository.findByKey(key, data);
    } catch (error) {
      logger("34-accountservice", error?.message);
      throw error
    }
  }

  public findById = async (id) => {
    try {
      return await this._accountRepository.findById(id);
    } catch (error) {
      logger("40-accountservice", error?.message);
      throw error
    }
  }

  public findByIdAndUpdate = async (id, update, session) => {
    try {
      return await this._accountRepository.updateById(id, update, session);
    } catch (error) {
      logger("52-accountservice", error?.message);
      throw error
    }
  }

}