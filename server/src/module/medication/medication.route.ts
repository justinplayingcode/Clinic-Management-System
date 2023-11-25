import { Router } from 'express';
import MedicationController from './medication.controller';
import middlewares from '../../middlewares';
import { Role } from '../../common/enum/permission';
const medicationRoute = Router();

const medicationController = new MedicationController();
medicationRoute.route('/create').post(middlewares.verifyToken, middlewares.permission([Role.admin]), medicationController.CreateMedication)
medicationRoute.route('/update').post(middlewares.verifyToken, middlewares.permission([Role.admin]), medicationController.UpdateMedication)
medicationRoute.route('/delete').put(middlewares.verifyToken, middlewares.permission([Role.admin]), medicationController.DeleteMedication)
medicationRoute.route("/getall").post(middlewares.verifyToken, medicationController.getAllMedication);
medicationRoute.route("/picker").post(middlewares.verifyToken, medicationController.getMedicationPicker);

export default medicationRoute;