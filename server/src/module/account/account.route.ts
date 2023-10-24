import { Router } from 'express';
import AccountController from './account.controller';
const accountRoute = Router();

accountRoute.route('/login').post(AccountController.Login);

export default accountRoute;