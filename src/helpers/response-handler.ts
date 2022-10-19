import C from "../constants";
import { HttpStatusCode } from "../constants/http-status-code.const";

/**
 * @class ResponseHandler
 * @description Handle reponse format abstraction
 */
export class ResponseHandler {

    static headers: Record<string, any> = { "content-type": "application/json" };

    /**
     * @method ok
     * @param {object} [data] Response data
     * @param {string} [message] Optional response message
     * @memberOf ResponseHandler
     */
    static ok(data?: object, message: string = C.ResponseMessage.OK) {
        return ResponseHandler.send(HttpStatusCode.SUCCESS, data, message);
    }

    /**
     * @method created
     * @param {object} [data] Response data
     * @param {string} [message] Optional response message
     * @memberOf ResponseHandler
     */
    static created(data?: object, message: string = C.ResponseMessage.CREATED) {
        return ResponseHandler.send(HttpStatusCode.CREATED, data, message);
    }

    /**
     * @method send
     * @param {HttpStatusCode} statusCode Response status code
     * @param {object} [data] Response data
     * @param {string} [message] Optional response message
     * @memberOf ResponseHandler
     */
    static send(
        statusCode: HttpStatusCode, 
        data?: object,
        message: string = C.ResponseMessage.SUCCESS,
    ) {
        return {
            statusCode,
            headers: this.headers,
            body: JSON.stringify((data || { message }) as any)
        }
    }

}