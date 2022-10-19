/* tslint:disable */
/* eslint-disable */
/**
 * Game-Player Manager Service
 * This service provides endpoints for all game-player manager related interactions
 *
 * OpenAPI spec version: 1.0.0
 * Contact: fatai@mail.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { ErrorMessageDto } from './error-message-dto';
/**
 * Status data, check additional message field.
 * @export
 * @interface StatusDto
 */
export interface StatusDto {
    /**
     * Status can be successful or failed, a value of true indicates success.
     * @type {boolean}
     * @memberof StatusDto
     */
    success: boolean;
    /**
     * additional message describing status.
     * @type {string}
     * @memberof StatusDto
     */
    message?: string;
    /**
     * Data associated with the status, this will not always be present
     * @type {{ [key: string]: any; }}
     * @memberof StatusDto
     */
    data?: { [key: string]: any; };
    /**
     * 
     * @type {ErrorMessageDto}
     * @memberof StatusDto
     */
    error?: ErrorMessageDto;
}
