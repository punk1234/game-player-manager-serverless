import {ValidateOptions} from "yup/lib/types";

export default abstract class BaseValidator {
    protected validationOpts: ValidateOptions = {abortEarly: false};
}
