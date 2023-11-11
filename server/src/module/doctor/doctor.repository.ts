import fields from "../../common/constant/fields";
import BaseRepository from "../common/common.repository";
import { DoctorModel } from "./doctor.model";

export default class DoctorRepository extends BaseRepository<DoctorModel> {

  public getDoctorOfStaticReport = async (page: number, pageSize: number, searchByColumn: string, searchKey: string, conditions: Partial<DoctorModel> = {}) => {
    return await this.model.find({ ...conditions })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select(`-__v -${fields.isActive}`)
      .populate({
        path: fields.userId,
        select: `-__v`,
        match: {
          [searchByColumn]: { $regex: new RegExp(searchKey, 'i') }
        }
      })
      .populate({
        path: fields.departmentId,
        select: `${fields.displayName}`,
      })
      .lean();
  }
}