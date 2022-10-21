import * as yup from "yup";
import {Service} from "typedi";
import BaseValidator from "./base.validator";

@Service()
export default class GameValidator extends BaseValidator {
    async checkCreateGame(data: any): Promise<void> {
        const schema = yup.object().shape({
            name: yup.string().required(),
            maxGamePlayScore: yup.number().positive().integer().required(),
            dailyMaxScoreSubmissionCount: yup.number().positive().integer().required(),
            description: yup.string(),
        });

        await schema.validate(data, this.validationOpts);
    }

    async checkUpdateGame(data: any): Promise<void> {
        const schema = yup.object().shape({
            gameId: yup.string().uuid().required(),
            name: yup.string(),
            maxGamePlayScore: yup.number().positive().integer(),
            dailyMaxScoreSubmissionCount: yup.number().positive().integer(),
            description: yup.string(),
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
