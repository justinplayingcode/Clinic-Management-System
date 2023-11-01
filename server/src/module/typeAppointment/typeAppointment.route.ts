import { Router } from "express";
import TypeAppointmentController from "./typeAppointment.controller";
import middlewares from "../../middlewares";
import { Role } from "../../common/enum/permission";

const typeAppointmentRoute = Router();

const typeAppointmentController = new TypeAppointmentController();

typeAppointmentRoute
  .route("/create")
  .post(middlewares.verifyToken,middlewares.permission([Role.admin]),typeAppointmentController.CreateTypeAppointment);
typeAppointmentRoute
  .route("/update")
  .post(middlewares.verifyToken,middlewares.permission([Role.admin]),typeAppointmentController.UpdateTypeAppointment);
typeAppointmentRoute
  .route("/delete")
  .put(middlewares.verifyToken,middlewares.permission([Role.admin]),typeAppointmentController.DeleteTypeAppointment);

export default typeAppointmentRoute;
