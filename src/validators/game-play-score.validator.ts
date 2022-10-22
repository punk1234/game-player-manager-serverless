import * as yup from "yup";
import { Service } from "typedi";
import BaseValidator from "./base.validator";

@Service()
export default class GamePlayScoreValidator extends BaseValidator {
  async checkScoreSubmission(data: any): Promise<void> {
    const schema = yup.object().shape({
      gameId: yup.string().uuid().required(),
      score: yup.number().positive().integer().required(),
    });

    await schema.validate(data, this.validationOpts);
  }
}
