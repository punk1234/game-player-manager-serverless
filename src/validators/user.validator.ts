import * as yup from "yup";
import { Service } from "typedi";
import { Gender } from "../models";
import BaseValidator from "./base.validator";
import { ValidateRequest } from "../decorators";

@Service()
@ValidateRequest({ abortEarly: false })
export default class UserValidator extends BaseValidator {
  checkRegisterUser(data: any): any {
    return yup.object().shape({
      username: yup.string().required(),
      password: yup.string().required(),
      beAdmin: yup.bool(),
      gender: yup.mixed().oneOf(Object.values(Gender)),
      bio: yup.string(),
    });

    // await schema.validate(data, this.validationOpts);
  }

  checkLogin(data: any): any {
    return yup.object().shape({
      username: yup.string().required(),
      password: yup.string().required(),
    });

    // await schema.validate(data, this.validationOpts);
  }

  checkUpdateProfile(data: any): any {
    return yup.object().shape({
      gender: yup.mixed().oneOf(Object.values(Gender)),
      bio: yup.string(),
    });

    // await schema.validate(data, this.validationOpts);
  }

  checkChangeUsername(data: any): any {
    return yup.object().shape({
      username: yup.string().required(),
    });

    // await schema.validate(data, this.validationOpts);
  }
}
