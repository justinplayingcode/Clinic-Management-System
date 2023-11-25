import BaseRepository from "../common/common.repository";
import {  MedicationModel } from "./medication.model";

export default class MedicationRepository extends BaseRepository<MedicationModel>{
    
  public getDataOfStaticReport = async (page: number, pageSize: number, searchByColumn: string, searchKey: string) => {
    return await this.model.find({ isActive: true, [searchByColumn]: { $regex: new RegExp(searchKey, 'i') } })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select(`-__v`)
      .lean();
  }

  public medicationPicker = async (searchKey) => {
    return await this.model.find({ isActive: true, displayName: { $regex: new RegExp(searchKey, 'i') } })
      .select("-__v -isActive")
      .lean();
  }
}