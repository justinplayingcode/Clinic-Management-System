import { ApiStatus, ApiStatusCode } from "../common/enum/apiStatusCode";
import { IBaseRespone } from "../common/model/responese";
import logger from "../helper/logger.config";

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || ApiStatusCode.ServerError;
  if (err.code === 11000) {
      err.statusCode = ApiStatusCode.BadRequest;
      for (let p in err.keyValue) {
          err.message = `${p} already exists`;
      }
  }
  if (err.kind === "ObjectId") {
      err.statusCode = ApiStatusCode.NotFound;
      err.message = `The ${req.originalUrl} is not found because of wrong ID`;
  }
  if(err.errors) {
      err.statusCode = ApiStatusCode.BadRequest;
      if (err.name !== "ValidationError") {
          err.message = [];
          for (let p in err.errors) {
              err.message.push(err.errors[p].properties?.message);
          }
      } 
  }
  const _res: IBaseRespone = {
    status: ApiStatus.fail,
    isSuccess: false,
    statusCode: err.statusCode,
    message: err.message
  }
  logger("errorHandler", err.message)
  res.status(err.statusCode).json(_res)
}

export default errorHandler;