import { ApiStatusCode } from "../../common/enum/apiStatusCode";
import validateReqBody from "../../common/utils/request.utils";
import logger from "../../helper/logger.config";
import { ILoginRequest, LoginRequest } from "./account.model";

export default class AccountController {
  // POST 
  public static Login = async (req: ILoginRequest, res, next) => {
    try {
        const verifyReq = validateReqBody(req, LoginRequest);
        if (!verifyReq.pass) {
          const err: any = new Error(verifyReq.message);
          err.statusCode = ApiStatusCode.BadRequest;
          return next(err)
        }
        res.status(ApiStatusCode.OK).json({
          message: "successful"
        })
        logger("login", "successful")
    } catch (error) {
        next(error)
    }
  }
}