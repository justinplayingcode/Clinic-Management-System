import { ClientSession } from "mongoose";
import { ICreateMedicalRecord } from "./medicalRecord.model";
import MedicalRecordRepository from "./medicalRecord.repository";
import MedicalRecord from "./medicalRecord.schema";
import logger from "../../helper/logger.config";

export default class MedicalRecordService {
  private _medicalRecordRepo;

  constructor() {
    this._medicalRecordRepo = new MedicalRecordRepository(MedicalRecord)
  }

  public createMedicalRecord = async (data: ICreateMedicalRecord, session: ClientSession) => {
    try {
      return await this._medicalRecordRepo.create(data, session);
    } catch (error) {
      logger("createMedicalRecord-medicalRecordService", error?.message);
      throw error;
    }
  }

}