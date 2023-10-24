import { ApiStatusCode } from "../common/enum/apiStatusCode";
import jwToken from "../helper/jwt.config";

const verifyToken = (req, res, next) => {
  const authorization = req.header('Authorization');
  if(!authorization) {
      const err: any = new Error('No token provided!');
      err.statusCode = ApiStatusCode.Forbidden;
      return next(err)
  } else {
      const token = authorization.replace('Bearer ', '');
      try {
          const payload = jwToken.getPayLoadInAccessToken(token);
          req.user = payload ;
          next();
      } catch (err) {
          if(err.name === 'TokenExpiredError') {
              err.message = 'TokenExpiredError';
              err.statusCode = ApiStatusCode.Forbidden;
          } else {
              err.message = "Unauthorized!";
              err.statusCode = ApiStatusCode.Unauthorized;
          }
          next(err)
      }
  }
}

export default verifyToken;