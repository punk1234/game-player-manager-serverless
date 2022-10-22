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
/**
 * Default error object for services. This gives consistent error object that all services may use.
 * @export
 * @interface ErrorMessageDto
 */
export interface ErrorMessageDto {
  /**
   * Error code
   * @type {string}
   * @memberof ErrorMessageDto
   */
  code: string;
  /**
   * Descriptive error message
   * @type {string}
   * @memberof ErrorMessageDto
   */
  message: string;
  /**
   * Additional data for this error message.
   * @type {{ [key: string]: any; }}
   * @memberof ErrorMessageDto
   */
  data?: { [key: string]: any };
}
