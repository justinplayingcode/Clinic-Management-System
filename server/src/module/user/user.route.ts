import { Router } from "express";
import UserController from "./user.controller";
import middlewares from "../../middlewares";

const userRoute = Router();
const userController = new UserController();

userRoute.route('/update').post(middlewares.verifyToken, userController.updateInfo);

export default userRoute;