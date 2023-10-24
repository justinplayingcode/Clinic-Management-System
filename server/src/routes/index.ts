import { Router } from 'express';
import accountRoute from '../module/account/account.route';

const routes = Router();

routes.use('/auth', accountRoute);

export default routes;