import { Router } from "express";
import DepartmentController from "./department.controller";
import middlewares from "../../middlewares";
import { Role } from "../../common/enum/permission";

const departmentRouter = Router();

const departmentController = new DepartmentController();
departmentRouter.route('/create').post(middlewares.verifyToken, middlewares.permission([Role.admin]), departmentController.CreateDepartment)
departmentRouter.route('/update').post(middlewares.verifyToken, middlewares.permission([Role.admin]), departmentController.updateDepartment)
departmentRouter.route('/delete').put(middlewares.verifyToken, middlewares.permission([Role.admin]), departmentController.deleteDepartment)
departmentRouter.route('/').get(middlewares.verifyToken, departmentController.getAll)
departmentRouter.route('/doctors').post(middlewares.verifyToken, departmentController.getDoctorInDepartment)

export default departmentRouter