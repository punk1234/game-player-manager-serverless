import { randomUUID } from "crypto";
import { Inject, Service } from "typedi";

import config from "../config";
import { default as C } from "../constants";
import { UserService } from "./user.service";
import { UserValidator } from "../validators";
import { UnauthenticatedError } from "../exceptions";
import { JwtHelper, PasswordHasher } from "../helpers";
import { IAuthTokenPayload, IUser } from "../interfaces";
import { LoginDto, LoginResponse, RegisterUserDto, User } from "../models";

@Service()
export class AuthService {
  // eslint-disable-next-line
  constructor(@Inject() private userService: UserService) {}

  /**
   * @method createUser
   * @async
   * @param {RegisterUserDto} data
   * @returns {Promise<User>}
   */
  async createUser(data: RegisterUserDto): Promise<User> {
    await this.userService.checkThatUsernameDoesNotExist(data.username);

    const USER_TO_CREATE = {
      ...data,
      id: randomUUID(),
      isAdmin: data.beAdmin || false,
      // beAdmin: undefined,
    };

    delete (USER_TO_CREATE as any).beAdmin;

    const CREATED_USER = await this.userService.createUser(USER_TO_CREATE, data.password);
    return CREATED_USER;
  }

  /**
   * @method login
   * @async
   * @param {LoginDto} data
   * @returns {Promise<LoginResponse>}
   */
  async login(data: LoginDto): Promise<LoginResponse> {
    const USER = await this.checkThatLoginCredentialsAreValid(data);

    const AUTH_TOKEN: string = JwtHelper.generateToken(
      { userId: USER.id, isAdmin: USER.isAdmin } as IAuthTokenPayload,
      `${config.JWT_TOKEN_TTL_IN_HOURS}h`,
    );

    delete USER.password;

    return {
      user: USER,
      token: AUTH_TOKEN,
    };
  }

  /**
   * @method checkThatLoginCredentialsAreValid
   * @async
   * @param {LoginDto} data
   * @returns {Promise<IUser>}
   */
  private async checkThatLoginCredentialsAreValid(data: LoginDto): Promise<IUser> {
    const USER = await this.userService.getUserByUsername(data.username);

    if (!USER) {
      throw new UnauthenticatedError(C.ResponseMessage.ERR_INVALID_CREDENTIALS);
    }

    const IS_CORRECT_PASSWORD = PasswordHasher.verify(data.password, USER.password as string);
    if (!IS_CORRECT_PASSWORD) {
      throw new UnauthenticatedError(C.ResponseMessage.ERR_INVALID_CREDENTIALS);
    }

    return USER;
  }
}
