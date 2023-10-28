import { Router } from 'express';
import AccountController from './account.controller';
import { Role } from '../../common/enum/permission';
const accountRoute = Router();
const accountController = new AccountController();
accountRoute.route('/login').post(accountController.Login);
accountRoute.route('/registeradmin').post(accountController.CreateAccount(Role.admin));
accountRoute.route('/registerdoctor').post(accountController.CreateAccount(Role.doctor)); //need to add verify permission
accountRoute.route('/register').post(accountController.CreateAccount(Role.user));

export default accountRoute;