import errorHandler from "./errorHandler"
import permission from "./permission"
import upload from "./upload"
import verifyToken from "./verifyToken"

const middlewares = {
  errorHandler: errorHandler,
  verifyToken,
  permission,
  upload
}

export default middlewares