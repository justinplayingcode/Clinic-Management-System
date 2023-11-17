import { Router } from 'express';
import MedicationController from './medication.controller';
import middlewares from '../../middlewares';
import { Role } from '../../common/enum/permission';
const medicationRoute = Router();

const medicationController = new MedicationController();
medicationRoute.route('/create').post(medicationController.CreateMedication)
medicationRoute.route('/update').post(medicationController.UpdateMedication)
medicationRoute.route('/delete').put(medicationController.DeleteMedication)
medicationRoute.route("/getall").post(middlewares.verifyToken, middlewares.permission([Role.admin]), medicationController.getAllMedication);



export default medicationRoute;