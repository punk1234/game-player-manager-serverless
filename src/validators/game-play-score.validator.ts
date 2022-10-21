import * as yup from "yup";
import { Service } from "typedi";
import { Gender, LoginDto } from "../models";
import BaseValidator from "./base.validator";
import { RegisterUserDto } from "../models/register-user-dto";

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