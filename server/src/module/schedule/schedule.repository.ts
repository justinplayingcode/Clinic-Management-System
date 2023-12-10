import BaseRepository from "../common/common.repository";

import { ScheduleModel } from "./schedule.model";

export default class ScheduleRepository extends BaseRepository<ScheduleModel> {

  public getAllByAccountId = async (accountId) => {
    return await this.model.find({ accountId })
      .sort({ statusUpdateTime: -1 })
      .select(`-__v -statusUpdateTime`)
      .lean();
  }

  public getAllByAdmin = async () => {
    return await this.model.find()
      .sort({ statusUpdateTime: -1 })
      .select(`-__v -statusUpdateTime`)
      .lean();
  }

  public getAll = async (conditions) => {
    return await this.model.find({ ...conditions })
      .sort({ statusUpdateTime: -1 })
      .select(`-__v -statusUpdateTime`)
      .lean();
  }

  public getForReport = async (page: number, pageSize: number, conditions: Partial<ScheduleModel> = {}) => {
    return await this.model.find({ ...conditions })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select(`-__v -statusUpdateTime`)
      .populate({
        path: "typeAppointmentId",
        select: `-__v`
      })
      .populate({
        path: "departmentId",
        select: `-__v`
      })
      .lean()
  }

  public getDetailById = async (id) => {
    return await this.model.findById(id)
    .select(`-__v -statusUpdateTime -accountId`)
    .populate({
      path: "typeAppointmentId",
      select: `-__v`
    })
    .populate({
      path: "departmentId",
      select: `-__v`
    })
    .populate({
      path: "patientId",
      select: `-__v`
    })
    .lean()
  }
}
