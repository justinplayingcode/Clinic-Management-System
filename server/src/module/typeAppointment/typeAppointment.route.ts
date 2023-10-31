import { Router } from "express";
import TypeAppointmentController from "./typeAppointment.controller";


const typeAppointmentRoute = Router();

const typeAppointmentController = new TypeAppointmentController();

typeAppointmentRoute.route('/create').post(typeAppointmentController.CreateTypeAppointment)
typeAppointmentRoute.route('/update').post(typeAppointmentController.UpdateTypeAppointment)
typeAppointmentRoute.route('/delete').put(typeAppointmentController.DeleteTypeAppointment)

export default typeAppointmentRoute;