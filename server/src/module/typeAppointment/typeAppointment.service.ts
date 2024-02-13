import { ClientSession } from "mongoose";
import { typeAppointmentModel } from "./typeAppointment.model";
import typeAppointmentRepository from "./typeAppointment.repository";
import TypeAppointment from "./typeAppointment.schema";
import ErrorObject from "../../common/model/error";
import { ApiStatusCode } from "../../common/enum/apiStatusCode";
import logger from "../../helper/logger.config";
// import { ClientSession } from "mongoose";

export default class typeAppointmentService {
  private _typeAppointmentRepository;

  constructor() {
    this._typeAppointmentRepository = new typeAppointmentRepository(
      TypeAppointment
    );
  }

  public createTypeAppointmentService = async (
    basic: typeAppointmentModel,
    session: ClientSession
  ) => {
    try {
      const newAppointment: typeAppointmentModel = {
        ...basic,
      };
      return await this._typeAppointmentRepository.create(
        newAppointment,
        session
      );
    } catch (error) {
      throw error;
    }
  };
  public updateTypeAppointmentService = async (
    Id: any,
    basic: typeAppointmentModel,
    session: ClientSession
  ) => {
    try {
      const updateAppointment: typeAppointmentModel = {
        ...basic,
      };
      const TargetTypeAppointment =
        (await this._typeAppointmentRepository.findById(
          Id
        )) as typeAppointmentModel;
      //check lai ho toi, chac ko can lam :))
      if (!TargetTypeAppointment) {
        const err: any = new ErrorObject(
          "Không có dữ liệu với ID đã cho",
          ApiStatusCode.BadRequest,
          "44-delteteMedicationService- service"
        );
        throw err;
      }
      return await this._typeAppointmentRepository.updateById(
        Id,
        updateAppointment,
        session
      );
    } catch (error) {
      throw error;
    }
  };
  public deleteDepartmentService = async (Id: any, session: ClientSession) => {
    try {
      const displayNameSuffix = " (Không còn hỗ trợ)";
      const TargetTypeAppointment =
        (await this._typeAppointmentRepository.findById(
          Id
        )) as typeAppointmentModel;
      //check lai ho toi, chac ko can lam :))
      if (!TargetTypeAppointment) {
        const err: any = new ErrorObject(
          "Không có dữ liệu với ID đã cho",
          ApiStatusCode.BadRequest,
          "44-delteteMedicationService- service"
        );
        throw err;
      }
      //check dk isActive = false => ko xoa nua
      if (!TargetTypeAppointment.isActive) {
        const err: any = new ErrorObject(
          "đã xóa thành công",
          ApiStatusCode.BadRequest,
          "47-deleteDepartment- service"
        );
        throw err;
      }
      let UpdatedMedication: typeAppointmentModel = TargetTypeAppointment;

      UpdatedMedication.displayName = `${TargetTypeAppointment.displayName} ${displayNameSuffix}`;
      UpdatedMedication.isActive = false;
      return await this._typeAppointmentRepository.updateById(
        Id,
        UpdatedMedication,
        session
      );
    } catch (error) {
      throw error;
    }
  };
  public getAllTypeAppointmentService = async () => {
    try {
      return await this._typeAppointmentRepository.getAll();
    } catch (error) {
      throw error;
    }
  }

  public findById = async (id) => {
    try {
      return await this._typeAppointmentRepository.findById(id);
    } catch (error) {
      logger("findById-typeappointmentService", error);
      throw error;
    }
  }
}
