import { Router } from 'express';
import accountRoute from '../module/account/account.route';
import userRoute from '../module/user/user.route';

const routes = Router();

routes.use('/auth', accountRoute);
routes.use('/user', userRoute);

export default routes;