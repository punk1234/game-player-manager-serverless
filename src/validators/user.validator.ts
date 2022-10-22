import * as yup from "yup";
import { Service } from "typedi";
import { Gender } from "../models";
import BaseValidator from "./base.validator";
import { ValidateRequest } from "../decorators";

@Service()
@ValidateRequest({ abortEarly: false })
export default class UserValidator extends BaseValidator {
  /**
   * @method checkRegisterUser
   * @param {*} data
   * @returns {any}
   */
  // eslint-disable-next-line
  checkRegisterUser(data: any): any {
    return yup.object().shape({
      username: yup.string().required(),
      password: yup.string().required(),
      beAdmin: yup.bool(),
      gender: yup.mixed().oneOf(Object.values(Gender)),
      bio: yup.string(),
    });
  }

  /**
   * @method checkLogin
   * @param {*} data
   * @returns {any}
   */
  // eslint-disable-next-line
  checkLogin(data: any): any {
    return yup.object().shape({
      username: yup.string().required(),
      password: yup.string().required(),
    });
  }

  /**
   * @method checkUpdateProfile
   * @param {*} data
   * @returns {any}
   */
  // eslint-disable-next-line
  checkUpdateProfile(data: any): any {
    return yup.object().shape({
      gender: yup.mixed().oneOf(Object.values(Gender)),
      bio: yup.string(),
    });
  }

  /**
   * @method checkChangeUsername
   * @param {*} data
   * @returns {any}
   */
  // eslint-disable-next-line
  checkChangeUsername(data: any): any {
    return yup.object().shape({
      username: yup.string().required(),
    });
  }
}
