import { ClientSession } from "mongoose";
import PrecriptionRepository from "./prescription.repository";
import Precription from "./prescription.schema";
import { ICreatePrecription } from "./prescription.model";
import logger from "../../helper/logger.config";

export default class PrecriptionService {
  private _precriptionRepo;

  constructor() {
    this._precriptionRepo = new PrecriptionRepository(Precription)
  }

  public createNewPrecription = async (data: ICreatePrecription, session: ClientSession) => {
    try {
      return await this._precriptionRepo.create(data, session);
    } catch (error) {
      logger("createNewPrecription-precriptionService", error?.message);
      throw error;
    }
  }
  public getInfoById = async (id) => {
    try {
      return await this._precriptionRepo.findById(id);
    } catch (error) {
      logger("getInfoById-precriptionService", error?.message);
      throw error;
    }
  }

}