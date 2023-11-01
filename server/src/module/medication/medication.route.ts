import { Router } from 'express';
import MedicationController from './mediaction.controller';
const medicationRoute = Router();

const medicationController = new MedicationController();
medicationRoute.route('/create').post(medicationController.CreateMedication)
medicationRoute.route('/update').post(medicationController.UpdateMedication)
medicationRoute.route('/delete').put(medicationController.DeleteMedication)




export default medicationRoute;