import { randomUUID } from "crypto";
import { Inject, Service } from "typedi";

import config from "../config";
import { UpdateUserDto, User } from "../models";
import { IUser } from "../interfaces";
import { PasswordHasher } from "../helpers";
import { ConflictError, NotFoundError, UnprocessableError } from "../exceptions";
import { DynamoDb } from "../database/adapters";


@Service()
export class UserService {

  constructor(@Inject() private db: DynamoDb) {}

  async createUser(data: User, plainTextPassword: string): Promise<User> {
    let USER_TO_CREATE: IUser = {
      ...data,
      password: PasswordHasher.hash(plainTextPassword)
    };

    await this.db.create<User>(config.USERS_TABLE, USER_TO_CREATE);
    delete USER_TO_CREATE.password;

    return USER_TO_CREATE;
  }

  async getUser(id: string): Promise<User> {
    const USER = await this.checkThatUserExist(id);
    delete USER.password;

    return USER;
  }

  async updateUser(userId: string, data: UpdateUserDto): Promise<User> {
    let queryExprs: Array<string> = [], exprValueMap: Record<string, any> = {};

    for(const [key, value] of Object.entries(data)) {
      queryExprs.push(`${key} = :${key}`);
      exprValueMap[`:${key}`] = value;
    }

    const UPDATED_USER = await this.db.update<IUser>(
      config.USERS_TABLE,
      { id: userId },
      queryExprs.join(", "),
      exprValueMap
    );

    return UPDATED_USER;
  }

  async changeUsername(userId: string, newUsername: string): Promise<User> {
    const NEW_USERNAME_USER = await this.getUserByUsername(newUsername);

    if(!NEW_USERNAME_USER) {
      return this.db.update(
        config.USERS_TABLE,
        { id: userId },
        "username = :username",
        { ":username": newUsername }
      );
    }
    
    if (NEW_USERNAME_USER.id === userId) {
      throw new ConflictError("New username is the same with current `username`");
    }

    throw new UnprocessableError("Username has been taken!");
  }

  async getUserByUsername(username: string): Promise<IUser> {
    return this.db.getItemByFilter<IUser>(
      config.USERS_TABLE,
      "username = :username",
      { ":username": username }
    );
  }

  async checkThatUserExist(id: string): Promise<IUser> {
    const USER = await this.db.getItemByKey<IUser>(config.USERS_TABLE, { id });
    if(USER) {
      return USER;
    }

    throw new NotFoundError("User not found!");
  }

  async checkThatUsernameDoesNotExist(username: string): Promise<void> {
    const user = await this.getUserByUsername(username);

    if(user) {
      throw new ConflictError("Username already exist!");
    }
  }

}