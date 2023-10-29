import BaseRepository from "../common/common.repository";
import { AccountModel } from "./account.model";


export default class AccountRepository extends BaseRepository<AccountModel> {

  public getAll = async () => {
    return this.model.find();
  }
  // other method
}