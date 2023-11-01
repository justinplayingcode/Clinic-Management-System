import { Router } from "express";
import AccountController from "./account.controller";
import { Role } from "../../common/enum/permission";
import middlewares from "../../middlewares";
const accountRoute = Router();
const accountController = new AccountController();
accountRoute.route("/login").post(accountController.Login);
accountRoute
  .route("/registeradmin")
  .post(accountController.CreateAccount(Role.admin));
accountRoute
  .route("/registerdoctor")
  .post(
    middlewares.verifyToken,
    middlewares.permission([Role.admin]),
    accountController.CreateAccount(Role.doctor)
  );
accountRoute
  .route("/register")
  .post(accountController.CreateAccount(Role.user));
accountRoute
  .route("/changepassword")
  .post(middlewares.verifyToken, accountController.changePassword);
accountRoute
  .route("/")
  .get(middlewares.verifyToken, accountController.getCurrentInfo);

export default accountRoute;
