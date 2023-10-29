import { ApiStatus, ApiStatusCode } from "../enum/apiStatusCode";

export interface IBaseRespone {
  status: ApiStatus;
  isSuccess: boolean;
  statusCode: ApiStatusCode;
  message?: string;
  data?: any;
}