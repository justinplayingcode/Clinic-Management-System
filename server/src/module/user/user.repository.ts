import fields from "../../common/constant/fields";
import BaseRepository from "../common/common.repository";
import { UserModel } from "./user.model";

export default class UserRepository extends BaseRepository<UserModel> {

  public getDataOfStaticReport = async (page: number, pageSize: number, searchByColumn: string, searchKey: string) => {
    return await this.model.find({ [searchByColumn]: { $regex: new RegExp(searchKey, 'i') } })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select(`-__v`)
      .populate({
        path: fields.accountId,
        select: `_id role`,
      })
      .lean();
  }

}
