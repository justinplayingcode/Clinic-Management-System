
import { ClientSession } from "mongoose";
import { MedicationModel } from "./medication.model";
import MedicationRepository from "./medication.repository";
import Medication from "./medication.schema";
import ErrorObject from "../../common/model/error";
import { ApiStatusCode } from "../../common/enum/apiStatusCode";


export default class medicationService {
    private _medicationRepository;

    constructor() {
        this._medicationRepository = new MedicationRepository(Medication)
    }
    public createMedicationService = async (basic: MedicationModel, session: ClientSession) => {
        try {
            const newMedication: MedicationModel = {
                ...basic
            }
            return await this._medicationRepository.create(newMedication,session)
        }
        catch(error){
            throw error;
        }
    }
    public updateMedicationService = async(Id: any, basic: MedicationModel, session: ClientSession) => {
        try {
            const updateMedication: MedicationModel = {
                ...basic
            }
            return await this._medicationRepository.updateById(Id, updateMedication, session)
        }
        catch(error){
            throw error
        }
    }
    public delteteMedicationService = async(Id: any, session: ClientSession) => {
        try {
            const currentTime = new Date().toString(); // Lấy thời gian hiện tại và chuyển thành chuỗi
            const displayNameSuffix = ' - delete';
            const TargetMedication = await this._medicationRepository.findById(Id) as MedicationModel;
            let UpdatedMedication: MedicationModel = TargetMedication;
            //check lai ho toi, chac ko can lam :))
            if(!UpdatedMedication){
                const err: any = new ErrorObject("Không có dữ liệu với ID đã cho",ApiStatusCode.BadRequest, "44-delteteMedicationService- service");
                throw err;
            }
            if(!UpdatedMedication.isActive){
                const err: any = new ErrorObject("đã xóa thành công",ApiStatusCode.BadRequest, "44-delteteMedicationService- service");
                throw err;
            }
            UpdatedMedication.displayName = `${TargetMedication.displayName} ${displayNameSuffix} ${currentTime}`;
            UpdatedMedication.isActive = false;

            return await this._medicationRepository.updateById(Id,UpdatedMedication, session);

        }
        catch(error){
            throw error;
        }
    }
}