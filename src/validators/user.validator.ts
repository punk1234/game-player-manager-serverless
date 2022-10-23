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
      username: yup.string().min(3).max(20).required(), // TODO: Can define `min` & `max` as constants
      password: yup.string().min(6).max(25).required(), // TODO: Can define `min` & `max` as constants
      beAdmin: yup.mixed().oneOf([true, false]),
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
      username: yup.string().min(3).max(20).required(),
      password: yup.string().min(6).max(25).required(),
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
      username: yup.string().min(3).max(20).required(),
    });
  }
}
