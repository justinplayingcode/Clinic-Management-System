import { ApiStatus, ApiStatusCode } from "../common/enum/apiStatusCode";

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || ApiStatusCode.ServerError;
  // Duplicate
  if (err.code === 11000) {
      err.statusCode = ApiStatusCode.BadRequest;
      for (let p in err.keyValue) {
          err.message = `${p} already exists`;
      }
  }
  // ObjectId: not found
  if (err.kind === "ObjectId") {
      err.statusCode = ApiStatusCode.NotFound;
      err.message = `The ${req.originalUrl} is not found because of wrong ID`;
  }
  // Validation
  if(err.errors) {
      err.statusCode = ApiStatusCode.BadRequest;
      if (err.name !== "ValidationError") {
          err.message = [];
          for (let p in err.errors) {
              err.message.push(err.errors[p].properties?.message);
          }
      } 
  }
  res.status(err.statusCode).json({
      status: ApiStatus.fail,
      message: err.message
  })
}

export default errorHandler;