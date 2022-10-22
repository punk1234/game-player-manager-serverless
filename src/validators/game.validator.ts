import * as yup from "yup";
import { Service } from "typedi";
import BaseValidator from "./base.validator";
import { ValidateRequest } from "../decorators";

@Service()
@ValidateRequest({ abortEarly: false })
export default class GameValidator extends BaseValidator {
  /**
   * @method checkCreateGame
   * @param {*} data
   * @returns {any}
   */
  // eslint-disable-next-line
  checkCreateGame(data: any): any {
    return yup.object().shape({
      name: yup.string().required(),
      maxGamePlayScore: yup.number().positive().integer().required(),
      dailyMaxScoreSubmissionCount: yup.number().positive().integer().required(),
      description: yup.string(),
    });
  }

  /**
   * @method checkUpdateGame
   * @param {*} data
   * @returns {any}
   */
  // eslint-disable-next-line
  checkUpdateGame(data: any): any {
    return yup.object().shape({
      gameId: yup.string().uuid().required(),
      name: yup.string(),
      maxGamePlayScore: yup.number().positive().integer(),
      dailyMaxScoreSubmissionCount: yup.number().positive().integer(),
      description: yup.string(),
    });
  }

  /**
   * @method checkGetGame
   * @param {*} data
   * @returns {any}
   */
  // eslint-disable-next-line
  checkGetGame(data: any): any {
    return yup.object().shape({
      gameId: yup.string().required().uuid(),
    });
  }
}
