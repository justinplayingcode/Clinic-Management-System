import { Router } from "express";
import AccountController from "./account.controller";
import { Role } from "../../common/enum/permission";
import middlewares from "../../middlewares";
import { IsUploadFor } from "../../common/enum/upload";
const accountRoute = Router();
const accountController = new AccountController();
accountRoute.route("/login").post(accountController.Login);
accountRoute.route("/register").post(accountController.CreateAccount(Role.user));
accountRoute.route("/changepassword").post(middlewares.verifyToken, accountController.changePassword);
accountRoute.route("/").get(middlewares.verifyToken, accountController.checkCurrentUser);
accountRoute.route("/user").get(middlewares.verifyToken, accountController.getCurrentInfo);
accountRoute.route("/resetpw").put(middlewares.verifyToken, middlewares.permission([Role.admin]), accountController.resetPassword); // role có thể dùng api này là admin
accountRoute.route("/uploadavatar").post(middlewares.verifyToken, middlewares.upload(IsUploadFor.avatar, "avatar"), accountController.uploadAvatar);
// accountRoute.route("/registeradmin").post(accountController.CreateAccount(Role.admin));

export default accountRoute;
