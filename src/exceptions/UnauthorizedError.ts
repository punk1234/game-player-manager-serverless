import K from "../constants";
import CustomError from "./CustomError";

/**
 * @class UnauthorizedError
 * @extends CustomError
 */
class UnauthorizedError extends CustomError {

    /**
     * @constructor
     * @param {string} message 
     * @param {object} metaData 
     */
    constructor(message: string = K.ResponseMessage.ERR_UNAUTHENTICATED, metaData: object = {}) {
        super(K.HttpStatusCode.UNAUTHORIZED, message, metaData);
    }

}

export default UnauthorizedError;