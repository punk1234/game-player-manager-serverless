import {User} from "../models";

/**
 * @interface IUser
 * @extends User
 */
export interface IUser extends User {
    password?: string;
}
