// import { ClientSession } from "mongoose";
import BaseRepository from "../common/common.repository";
import { DepartmentModel } from "./department.model";

export default class DepartmentRepository extends BaseRepository<DepartmentModel> {
  public getAllDepartment = async () => {
    return await this.model.find({ isActive: true }).select("displayName _id")
  }
}