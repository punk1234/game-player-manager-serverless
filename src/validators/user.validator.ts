import * as yup from "yup";
import {Service} from "typedi";
import {Gender} from "../models";
import BaseValidator from "./base.validator";

@Service()
export default class UserValidator extends BaseValidator {
    async checkRegisterUser(data: any): Promise<void> {
        const schema = yup.object().shape({
            username: yup.string().required(),
            password: yup.string().required(),
            beAdmin: yup.bool(),
            gender: yup.mixed().oneOf(Object.values(Gender)),
            bio: yup.string(),
        });

        await schema.validate(data, this.validationOpts);
    }

    async checkLogin(data: any): Promise<void> {
        const schema = yup.object().shape({
            username: yup.string().required(),
            password: yup.string().required(),
        });

        await schema.validate(data, this.validationOpts);
    }

    async checkUpdateProfile(data: any): Promise<void> {
        const schema = yup.object().shape({
            gender: yup.mixed().oneOf(Object.values(Gender)),
            bio: yup.string(),
        });

        await schema.validate(data, this.validationOpts);
    }

    async checkChangeUsername(data: any): Promise<void> {
        const schema = yup.object().shape({
            username: yup.string().required(),
        });

        await schema.validate(data, this.validationOpts);
    }
}
