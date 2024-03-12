import { ClientSession } from "mongoose";
import logger from "../../helper/logger.config";
import { ICreateBill } from "./bill.model";
import BillRepository from "./bill.repository";
import Bill from "./bill.schema";

export default class BillService {
  private _billRepo;
  constructor() {
    this._billRepo = new BillRepository(Bill);
  }

  public createBill = async (data: ICreateBill, session: ClientSession) => {
    try {
      return await this._billRepo.create(data, session);
    } catch (error) {
      logger("createBill-billService", error?.message);
      throw error;
    }
  }

  public getInfoByMedicalId = async (id) => {
    try {
      return await this._billRepo.findByKey("medicalRecordId", id);
    } catch (error) {
      logger("getInfoByMedicalId-billService", error?.message);
      throw error;
    }
  }
}