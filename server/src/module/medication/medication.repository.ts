import { ClientSession } from "mongoose";
import BaseRepository from "../common/common.repository";
import {  MedicationModel } from "./medication.model";

export default class MedicationRepository extends BaseRepository<MedicationModel>{
    
    public createMedication = async(data: any, session: ClientSession) => {
        const Medication = new this.model(data);

        return await this.create(Medication,session);
    }
    public updateMedication = async(Id: any, data: any, session:ClientSession) => {
        const UpdatedMedication = data;
        return this.updateById(Id, UpdatedMedication, session);
    }
    public deleteMedication = async(Id: any, session:ClientSession) => {
        const currentTime = new Date().toISOString(); // Lấy thời gian hiện tại và chuyển thành chuỗi
        const displayNameSuffix = ' - delete';
        const TargetMedication = await this.findById(Id) as MedicationModel;
        console.log(TargetMedication);
        
        let UpdatedMedication: MedicationModel = TargetMedication;

        UpdatedMedication.displayName = `${TargetMedication.displayName} ${displayNameSuffix} ${currentTime}`;
        UpdatedMedication.isActive = false;
        // console.log( "day la obj moi \n"+ UpdatedMedication + "cahn");

        return this.updateById(Id, UpdatedMedication, session);
    }
}