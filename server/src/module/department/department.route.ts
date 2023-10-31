import { Router } from "express";
import DepartmentController from "./department.controller";

const departmentRouter = Router();

const departmentController = new DepartmentController();
departmentRouter.route('/create').post(departmentController.CreateDepartment)
departmentRouter.route('/update').post(departmentController.updateDepartment)
departmentRouter.route('/delete').put(departmentController.deleteDepartment)

export default departmentRouter