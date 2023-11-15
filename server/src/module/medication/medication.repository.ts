// import { ClientSession } from "mongoose";
import BaseRepository from "../common/common.repository";
import {  MedicationModel } from "./medication.model";

export default class MedicationRepository extends BaseRepository<MedicationModel>{
    
  public getDataOfStaticReport = async (page: number, pageSize: number, searchByColumn: string, searchKey: string) => {
    return await this.model.find({ [searchByColumn]: { $regex: new RegExp(searchKey, 'i') } })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select(`-__v`)
      .lean();
  }
}