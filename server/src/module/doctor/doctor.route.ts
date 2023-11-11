import { Router } from "express";
import DoctorController from "./doctor.controller";
import middlewares from "../../middlewares";
import { Role } from "../../common/enum/permission";

const doctorRoute = Router();
const doctorController = new DoctorController();

doctorRoute.route("/register").post(middlewares.verifyToken, middlewares.permission([Role.admin]), doctorController.CreateAccount);
doctorRoute.route("/update").post(middlewares.verifyToken, middlewares.permission([Role.admin]),doctorController.UpdateDoctor)
doctorRoute.route("/delete").put(middlewares.verifyToken, middlewares.permission([Role.admin]),doctorController.deleteDoctor);
doctorRoute.route("/").post(middlewares.verifyToken, middlewares.permission([Role.admin]),doctorController.getAllForReport);

export default doctorRoute;