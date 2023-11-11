import { Router } from "express";
import UserController from "./user.controller";
import middlewares from "../../middlewares";
import AccountController from "../account/account.controller";
import { Role } from "../../common/enum/permission";

const userRoute = Router();
const userController = new UserController();
const accountController = new AccountController();

userRoute.route("/update").post(middlewares.verifyToken, userController.updateInfo);
userRoute.route("/getall").post(middlewares.verifyToken, middlewares.permission([Role.admin]), accountController.getAllUser);

export default userRoute;
