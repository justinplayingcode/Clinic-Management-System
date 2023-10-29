import { ClientSession } from "mongoose";
import AccountRepository from "./account.repository";
import Account from "./account.schema";
import { AccountModel, ICreateAcountBasic } from "./account.model";
import { Role } from "../../common/enum/permission";

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
      return this._accountRepository.create(newAccount, session);
    } catch (error) {
      throw error
    }
  }

  public findByKey = async (key, data) => {
    try {
      return this._accountRepository.findByKey(key, data);
    } catch (error) {
      throw error
    }
  }

}