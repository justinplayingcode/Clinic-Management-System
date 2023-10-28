import { ApiStatus, ApiStatusCode } from "../enum/apiStatusCode";

export interface IBaseRespone {
  status: ApiStatus;
  isSuccess: boolean;
  message?: string;
  statusCode: ApiStatusCode;
}