import { ClientSession } from "mongoose";
import { DepartmentModel } from "./department.model";
import DepartmentRepository from "./department.repository";

import Department from "./department.schema";
import ErrorObject from "../../common/model/error";
import { ApiStatusCode } from "../../common/enum/apiStatusCode";

export default class departmentService {
  private _departmentRepository;
  constructor() {
    this._departmentRepository = new DepartmentRepository(Department);
  }
  public createDepartment = async (
    basic: DepartmentModel,
    session: ClientSession
  ) => {
    try {
      return await this._departmentRepository.create(basic, session);
    } catch (error) {
      throw error;
    }
  };

  public updateDepartment = async (
    Id: any,
    basic: DepartmentModel,
    session: ClientSession
  ) => {
    try {
      const TargetDepartment = (await this._departmentRepository.findById(
        Id
      )) as DepartmentModel;
      if (!TargetDepartment) {
        const err: any = new ErrorObject(
          "Không có dữ liệu với ID đã cho",
          ApiStatusCode.BadRequest,
          "44-delteteMedicationService- service"
        );
        throw err;
      }
      return await this._departmentRepository.updateById(Id, basic, session);
    } catch (error) {
      throw error;
    }
  };

  public delteteDepartmentService = async (Id: any, session: ClientSession) => {
    try {
      const currentTime = new Date().toString();
      const displayNameSuffix = " - delete";
      const TargetDepartment = (await this._departmentRepository.findById(
        Id
      )) as DepartmentModel;
      if (!TargetDepartment) {
        const err: any = new ErrorObject(
          "Không có dữ liệu với ID đã cho",
          ApiStatusCode.BadRequest,
          "44-delteteMedicationService- service"
        );
        throw err;
      }
      if (!TargetDepartment.isActive) {
        const err: any = new ErrorObject(
          "đã xóa thành công",
          ApiStatusCode.BadRequest,
          "47-deleteDepartment- service"
        );
        throw err;
      }
      let UpdatedDepartment: DepartmentModel = TargetDepartment;
      UpdatedDepartment.displayName = `${TargetDepartment.displayName} ${displayNameSuffix} ${currentTime}`;
      UpdatedDepartment.isActive = false;
      return await this._departmentRepository.updateById(
        Id,
        UpdatedDepartment,
        session
      );
    } catch (error) {
      throw error;
    }
  };

  public getAll = async () => {
    try {
      return await this._departmentRepository.getAllDepartment();
    } catch (error) {
      throw error
    }
  }

  public findById = async (id) => {
    try {
      return await this._departmentRepository.findById(id)
    } catch (error) {
      throw error;
    }
  }
}
