import message from "../common/constant/message";
import { ApiStatusCode } from "../common/enum/apiStatusCode";
import { Role } from "../common/enum/permission";

const permission = (acceptedRoles: Role[]) => {
  return function (req, res, next) {
    try {
      const payload = req.user;
        if (!acceptedRoles.includes(payload.role)) {
            const error: any = new Error(message.NoPermission());
            error.statusCode = ApiStatusCode.Forbidden;
            return next(error)
        } else {
          next();
        }
    } catch (error) {
      next(error)
    }
  }
}

export default permission;