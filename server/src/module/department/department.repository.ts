import { ClientSession } from "mongoose";
import BaseRepository from "../common/common.repository";
import { DepartmentModel } from "./department.model";

export default class DepartmentRepository extends BaseRepository<DepartmentModel> {

    public createDepartment = async(data: any, session: ClientSession) => {
        const Department = new this.model(data);
        return await this.create(Department,session);
    }
    public updateDepartment = async(Id: any, data: any, session: ClientSession) => {
        const UpdatedDepartment = data;
        return this.updateById(Id,UpdatedDepartment,session);
    }
    public deleteDepartment = async(Id: any, session:ClientSession) => {
        const currentTime = new Date().toString(); // Lấy thời gian hiện tại và chuyển thành chuỗi
        const displayNameSuffix = ' - delete';
        const TargetMedication = await this.findById(Id) as DepartmentModel;
        // console.log(TargetMedication);
        
        let UpdatedMedication: DepartmentModel = TargetMedication;

        UpdatedMedication.displayName = `${TargetMedication.displayName} ${displayNameSuffix} ${currentTime}`
        UpdatedMedication.isActive = false;
        // console.log( "day la obj moi \n"+ UpdatedMedication + "cahn");

        return this.updateById(Id, UpdatedMedication, session);
    }
}