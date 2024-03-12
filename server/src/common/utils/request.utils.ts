import { IValidateReqBody } from "../model/request";

const validateReqBody = (req, requiredFields: string[]): IValidateReqBody => {
  const missingFields = [];
  requiredFields.forEach((field) => {
      if (!(field in req.body)) {
          missingFields.push(field);
      }
  });
  const result: IValidateReqBody = {
      pass: true,
      message: ""
  }
  if (missingFields.length > 0) {
      result.pass = false;
      result.message = `Missing required field(s): ${missingFields.join(', ')}`;
  }
  return result
};

export default validateReqBody
