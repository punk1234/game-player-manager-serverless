import * as yup from "yup";
import { Service } from "typedi";
import { Gender, LoginDto } from "../models";
import BaseValidator from "./base.validator";
import { RegisterUserDto } from "../models/register-user-dto";

@Service()
export default class GameValidator extends BaseValidator {
  
  async checkCreateGame(data: any): Promise<void> {
    const schema = yup.object().shape({
      name: yup.string().required(),
      maxGamePlayScore: yup.number().positive().integer().required(),
      dailyMaxScoreSubmission: yup.number().positive().integer().required(),
      description: yup.string()
    });
    
    await schema.validate(data, this.validationOpts);
  }

  async checkUpdateGame(data: any): Promise<void> {
    const schema = yup.object().shape({
      gameId: yup.string().uuid().required(),
      name: yup.string(),
      maxGamePlayScore: yup.number().positive().integer(),
      dailyMaxScoreSubmission: yup.number().positive().integer(),
      description: yup.string()
    });
    
    await schema.validate(data, this.validationOpts);
  }

  async checkGetGame(data: any): Promise<void> {
    const schema = yup.object().shape({
      gameId: yup.string().required().uuid(),
    });
    
    await schema.validate(data, this.validationOpts);
  }
  
}