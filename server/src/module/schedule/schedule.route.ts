import { Router } from "express";
import ScheduleController from "./schedule.controller";
import middlewares from "../../middlewares";
import { Role } from "../../common/enum/permission";

const scheduleRoute = Router();
const scheduleController = new ScheduleController();
scheduleRoute.route("/").get(middlewares.verifyToken, scheduleController.getSchedule);
scheduleRoute.route("/usercreate").post(middlewares.verifyToken, middlewares.permission([Role.user]), scheduleController.userCreateSchedule);
scheduleRoute.route("/adminverify").post(middlewares.verifyToken, middlewares.permission([Role.admin]), scheduleController.adminVerifySchedule);
scheduleRoute.route("/doctorverify").post(middlewares.verifyToken, middlewares.permission([Role.doctor]), scheduleController.doctorVerifySchedule);
scheduleRoute.route("/complete").post(middlewares.verifyToken, middlewares.permission([Role.doctor]), scheduleController.completeSchedule);
scheduleRoute.route("/getcomplete").post(middlewares.verifyToken, scheduleController.getAllCompleteSchedule);
scheduleRoute.route("/detail").get(middlewares.verifyToken, scheduleController.getDetailCompleteSchedule);

export default scheduleRoute;