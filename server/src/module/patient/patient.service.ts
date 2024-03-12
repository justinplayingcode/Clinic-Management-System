import { ClientSession } from "mongoose";
import PatientRepository from "./patient.repository";
import Patient from "./patient.schema";
import { ICreatePatient } from "./patient.model";
import logger from "../../helper/logger.config";
import MomentTimezone from "../../helper/timezone.config";

export default class PatientService {
  private _patientRepository;
  constructor() {
    this._patientRepository = new PatientRepository(Patient);
  }

  public create = async (data: ICreatePatient, session: ClientSession) => {
    try {
      return await this._patientRepository.create(data, session);
    } catch (error) {
      throw error;
    }
  }

  public getInfoById = async (id) => {
    try {
      const { fullName, dateOfBirth, address, phoneNumber, insurance, gender, guardianName, guardianPhoneNumber, guardianRelationship } = await this._patientRepository.findById(id);
      return {
        fullName,
        dateOfBirth: MomentTimezone.convertDDMMYYY(dateOfBirth),
        address,
        phoneNumber,
        insurance,
        gender,
        guardianName: guardianName ? guardianName : "",
        guardianPhoneNumber: guardianPhoneNumber ? guardianPhoneNumber : "",
        guardianRelationship: guardianRelationship ? guardianRelationship : "",
      }
    } catch (error) {
      logger("getInfoById-patientservice", error?.message);
      throw error;
    }
  }
}