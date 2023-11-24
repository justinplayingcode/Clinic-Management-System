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
}
