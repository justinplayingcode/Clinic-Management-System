import { ClientSession, Model } from "mongoose";
import { BaseModel } from "../../common/model/common";

export default class BaseRepository<T extends BaseModel> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }
  public create = async (data: Partial<T>, session: ClientSession): Promise<T> => {
      const newcreate = new this.model(data);
      return await newcreate.save({ session });
  }

  public findById = async (id: string): Promise<T | null> => {
    return await this.model.findById(id).exec();
  }

  public findByKey = async (key: any, data: Partial<T>): Promise<T | null> => {
    return await this.model.findOne({ [key]: data }).exec();
  }

  public updateById = async (id: string, update: Partial<T>, session: ClientSession) => {
    return await this.model.findByIdAndUpdate(id, update, { new: true, runValidators: true, session})
  }

  public updateByKey = async (conditions: Partial<T>, update: Partial<T>, session: ClientSession) => {
    return await this.model.findOneAndUpdate(conditions, update, { new: true, runValidators: true, session})
  }
}