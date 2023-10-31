import { Router } from "express";
import TypeAppointmentController from "./typeAppointment.controller";


const typeAppointmentRoute = Router();

const typeAppointmentController = new TypeAppointmentController();

typeAppointmentRoute.route('/create').post(typeAppointmentController.CreateTypeAppointment)
typeAppointmentRoute.route('/update/:id').post(typeAppointmentController.UpdateTypeAppointment)
typeAppointmentRoute.route('/delete/:id').get(typeAppointmentController.DeleteTypeAppointment)

export default typeAppointmentRoute;