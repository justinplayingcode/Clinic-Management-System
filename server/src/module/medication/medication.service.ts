
import { ClientSession } from "mongoose";
import { MedicationModel } from "./medication.model";
import MedicationRepository from "./medication.repository";
import Medication from "./medication.schema";


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
            return await this._medicationRepository.createMedication(newMedication,session)
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
            return await this._medicationRepository.updateMedication(Id, updateMedication, session)
        }
        catch(error){
            throw error
        }
    }
    public delteteMedicationService = async(Id: any, session: ClientSession) => {
        try {
            
            return await this._medicationRepository.deleteMedication(Id, session);
        }
        catch(error){
            throw error;
        }
    }
}