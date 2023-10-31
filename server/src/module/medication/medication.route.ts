import { Router } from 'express';
import MedicationController from './mediaction.controller';
const medicationRoute = Router();

const medicationController = new MedicationController();
medicationRoute.route('/create').post(medicationController.CreateMedication)
medicationRoute.route('/update/:id').post(medicationController.UpdateMedication)
medicationRoute.route('/delete/:id').get(medicationController.DeleteMedication)




export default medicationRoute;