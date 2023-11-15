import { Router } from "express";
import UserController from "./user.controller";
import middlewares from "../../middlewares";
import AccountController from "../account/account.controller";


const userRoute = Router();
const userController = new UserController();
const accountController = new AccountController();

userRoute.route("/update").post(middlewares.verifyToken, userController.updateInfo);
userRoute.route("/getall").post(accountController.getAllUser);

export default userRoute;
