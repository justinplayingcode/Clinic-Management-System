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
      return await this._departmentRepository.updateById(Id, basic, session);
    } catch (error) {
      throw error;
    }
  };
  public delteteDepartmentService = async (Id: any, session: ClientSession) => {
    try {
      const currentTime = new Date().toString(); // Lấy thời gian hiện tại và chuyển thành chuỗi
      const displayNameSuffix = " - delete";
      const TargetDepartment = (await this._departmentRepository.findById(
        Id
      )) as DepartmentModel;
      //check lai ho toi, chac ko can lam :))
      if (!TargetDepartment) {
        const err: any = new ErrorObject(
          "Không có dữ liệu với ID đã cho",
          ApiStatusCode.BadRequest,
          "44-delteteMedicationService- service"
        );
        throw err;
      }
      //check dk isActive = false => ko xoa nua
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
}
