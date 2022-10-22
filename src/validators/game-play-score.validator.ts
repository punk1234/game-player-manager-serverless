import * as yup from "yup";
import { Service } from "typedi";
import BaseValidator from "./base.validator";
import { ValidateRequest } from "../decorators";

@Service()
@ValidateRequest({ abortEarly: false })
export default class GamePlayScoreValidator extends BaseValidator {
  /**
   * @method checkScoreSubmission
   * @param {*} data
   * @returns {any}
   */
  // eslint-disable-next-line
  checkScoreSubmission(data: any): any {
    return yup.object().shape({
      gameId: yup.string().uuid().required(),
      score: yup.number().positive().integer().required(),
    });
  }
}
