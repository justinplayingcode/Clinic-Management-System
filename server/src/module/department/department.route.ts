import { Router } from "express";
import DepartmentController from "./department.controller";

const departmentRouter = Router();

const departmentController = new DepartmentController();
departmentRouter.route('/create').post(departmentController.CreateDepartment)
departmentRouter.route('/update/:id').post(departmentController.updateDepartment)
departmentRouter.route('/delete/:id').get(departmentController.deleteDepartment)

export default departmentRouter