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
import { Gender } from './gender';
/**
 * 
 * @export
 * @interface RegisterUserDto
 */
export interface RegisterUserDto {
    /**
     * User's username in platform
     * @type {string}
     * @memberof RegisterUserDto
     */
    username: string;
    /**
     * 
     * @type {string}
     * @memberof RegisterUserDto
     */
    password: string;
    /**
     * 
     * @type {boolean}
     * @memberof RegisterUserDto
     */
    beAdmin?: boolean;
    /**
     * 
     * @type {Gender}
     * @memberof RegisterUserDto
     */
    gender?: Gender;
    /**
     * User biography (information about user)
     * @type {string}
     * @memberof RegisterUserDto
     */
    bio?: string;
}