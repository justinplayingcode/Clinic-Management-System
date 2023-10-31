
import { ClientSession } from "mongoose";
import BaseRepository from "../common/common.repository";
import { typeAppointmentModel } from "./typeAppointment.model"; 
export default class typeAppointmentRepository extends BaseRepository<typeAppointmentModel>{
    public createTypeAppointment = async(data: any, session: ClientSession) => {
        const TypeAppointment = new this.model(data);

        return await this.create(TypeAppointment,session);

    }
    public updateTypeAppointment = async (Id: any,data: any, session: ClientSession) => {
        const UpdatedTypeAppointment = data;
    
        return this.updateById(Id,UpdatedTypeAppointment,session)
    }
    public deleteTypeAppointment = async(Id: any, session:ClientSession) => {
        const currentTime = new Date().toISOString(); // Lấy thời gian hiện tại và chuyển thành chuỗi
        const displayNameSuffix = ' - delete';
        const TargetTypeAppointment = await this.findById(Id) as typeAppointmentModel;
        
        
        let UpdatedMedication: typeAppointmentModel = TargetTypeAppointment;

        UpdatedMedication.displayName = `${TargetTypeAppointment.displayName} ${displayNameSuffix} ${currentTime}`
        UpdatedMedication.isActive = false;
        // console.log( "day la obj moi \n"+ UpdatedMedication + "cahn");

        return this.updateById(Id, UpdatedMedication, session);
    }
}