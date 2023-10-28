import { ClientSession, Model } from "mongoose";
import { BaseModel } from "./common.model";

export default class BaseRepository<T extends BaseModel> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  public create = async (data: Partial<T>, session: ClientSession): Promise<T> => {
      const user = new this.model(data);
      return user.save({ session });
  }

  public findById = async (id: string): Promise<T | null> => {
    return this.model.findById(id).exec();
  }

  public findByKey = async (key: any, data: Partial<T>): Promise<T | null> => {
    return this.model.findOne({ [key]: data }).exec();
  }

  public updateById = async (id: string, update: Partial<T>, session: ClientSession) => {
    return this.model.findByIdAndUpdate(id, update, { new: true, runValidators: true, session})
  }

  public updateByKey = async (id: string, key: any, value: any, session: ClientSession) => {
    return this.model.findByIdAndUpdate(id, { [key]: value }, { new: true, runValidators: true, session})
  }
}