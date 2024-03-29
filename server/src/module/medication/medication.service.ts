import { ClientSession } from "mongoose";
import { IRequestGetAllOfStaticReport, MedicationModel } from "./medication.model";
import MedicationRepository from "./medication.repository";
import Medication from "./medication.schema";
import ErrorObject from "../../common/model/error";
import { ApiStatusCode } from "../../common/enum/apiStatusCode";
import logger from "../../helper/logger.config";

export default class medicationService {
  private _medicationRepository;
  constructor() {
    this._medicationRepository = new MedicationRepository(Medication);
  }

  public createMedicationService = async (
    basic: MedicationModel,
    session: ClientSession
  ) => {
    try {
      return await this._medicationRepository.create(basic, session);
    } catch (error) {
      throw error;
    }
  };

  public updateMedicationService = async (
    Id: any,
    basic: MedicationModel,
    session: ClientSession
  ) => {
    try {
      const TargetMedication = (await this._medicationRepository.findById(
        Id
      )) as MedicationModel;
      let UpdatedMedication: MedicationModel = TargetMedication;
      if (!UpdatedMedication) {
        const err: any = new ErrorObject(
          "Không có dữ liệu với ID đã cho",
          ApiStatusCode.BadRequest,
          "39-updateMedicationService- service"
        );
        throw err;
      }
      return await this._medicationRepository.updateById(Id, basic, session);
    } catch (error) {
      throw error;
    }
  };

  public delteteMedicationService = async (Id: any, session: ClientSession) => {
    try {
      const currentTime = new Date().toString();
      const displayNameSuffix = " - delete";
      const TargetMedication = (await this._medicationRepository.findById(
        Id
      )) as MedicationModel;
      let UpdatedMedication: MedicationModel = TargetMedication;
      if (!UpdatedMedication) {
        const err: any = new ErrorObject(
          "Không có dữ liệu với ID đã cho",
          ApiStatusCode.BadRequest,
          "44-delteteMedicationService- service"
        );
        throw err;
      }
      if (!UpdatedMedication.isActive) {
        const err: any = new ErrorObject(
          "đã xóa thành công",
          ApiStatusCode.BadRequest,
          "44-delteteMedicationService- service"
        );
        throw err;
      }
      UpdatedMedication.displayName = `${TargetMedication.displayName} ${displayNameSuffix} ${currentTime}`;
      UpdatedMedication.isActive = false;
      return await this._medicationRepository.updateById(
        Id,
        UpdatedMedication,
        session
      );
    } catch (error) {
      throw error;
    }
  };
  
  public getDataOfStaticReport = async (request: IRequestGetAllOfStaticReport) => {
    try {
      const total = await this._medicationRepository.getTotalOfStaticReport(request.searchByColumn, request.searchKey);
      const medications = await this._medicationRepository.getDataOfStaticReport(
        request.page,
        request.pageSize,
        request.searchByColumn,
        request.searchKey
      );
      const result: any[] = [];
      medications.forEach(medication => {
        result.push({
          ...medication,
        })
      })
      return {
        values: result,
        total
      };
    } catch (error) {
      logger("getall-mediactionservice", error?.message);
      throw error;
    }
  }

  public MedicationsPicker = async (searchKey) => {
    try {
      return await this._medicationRepository.medicationPicker(searchKey);
    } catch (error) {
      logger("MedicationsPicker-mediactionservice", error?.message);
      throw error;
    }
  }
}