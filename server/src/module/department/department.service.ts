
import { ClientSession } from "mongoose";
import { DepartmentModel } from "./department.model";
import DepartmentRepository from "./department.repository";
import Department from "./department.schema";


export default class departmentService {
    private _departmentRepository;
    constructor() {
        this._departmentRepository = new DepartmentRepository(Department)
    }
    public createDepartment = async (basic: DepartmentModel, session: ClientSession) => {
        try {
            const newDepartment: DepartmentModel = {
                ...basic
            }
            return await this._departmentRepository.createDepartment(newDepartment, session)
        }
        catch(error){
            throw error
        }
    }
    public updateDepartment = async (Id: any, basic: DepartmentModel, session: ClientSession) => {
        try {
            const updateDepartment: DepartmentModel = {
                ...basic
            }
            return await this._departmentRepository.updateDepartment(Id,updateDepartment,session)
        }
        catch(error){
            throw error
        }
    }
    public delteteDepartmentService = async (Id: any, session: ClientSession) => {
        try {
            
            return await this._departmentRepository.deleteDepartment(Id, session);
        }
        catch(error){
            throw error;
        }
    }
}