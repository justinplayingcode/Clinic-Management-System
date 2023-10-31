import { ClientSession } from "mongoose";
import { typeAppointmentModel } from "./typeAppointment.model";
import typeAppointmentRepository from "./typeAppointment.repository";
import TypeAppointment from "./typeAppointment.schema";
// import { ClientSession } from "mongoose";



export default class typeAppointmentService {
    private _typeAppointmentRepository;

    constructor() {
        this._typeAppointmentRepository = new typeAppointmentRepository(TypeAppointment);
    }

    public createTypeAppointmentService = async (basic: typeAppointmentModel,session: ClientSession) =>{
        try {
            const newAppointment: typeAppointmentModel = {
                ...basic
            }
            return await this._typeAppointmentRepository.createTypeAppointment(newAppointment,session);
        }
        catch (error){
            throw error
        }
    }
    public updateTypeAppointmentService = async (Id: any, basic: typeAppointmentModel, session: ClientSession) => {
        try {
            const updateAppointment: typeAppointmentModel = {
                ...basic
            }
            return await this._typeAppointmentRepository.updateTypeAppointment(Id, updateAppointment,session)
        }
        catch(error){
            throw error
        }
    }
    public delteteDepartmentService = async (Id: any, session: ClientSession) => {
        try {
            
            return await this._typeAppointmentRepository.deleteTypeAppointment(Id, session);
        }
        catch(error){
            throw error;
        }
    }
}