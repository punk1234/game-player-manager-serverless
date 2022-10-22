import { Service, Container } from "typedi";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { ResponseHandler } from "../helpers";
import { UserValidator } from "../validators";
import { HandleExceptions } from "../decorators";
import { AuthService } from "../services/auth.service";

const AUTH_SERVICE = Container.get(AuthService);

@Service()
export class AuthApiHandler {
  /**
   * @method registerUser
   * @param {APIGatewayProxyEvent} event
   * @returns {Promise<APIGatewayProxyResult>}
   */
  @HandleExceptions()
  async registerUser(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const REQ_BODY = JSON.parse(event.body as string);
    await UserValidator.checkRegisterUser(REQ_BODY);

    const USER = await AUTH_SERVICE.createUser(REQ_BODY);

    return ResponseHandler.created(USER);
  }

  /**
   * @method login
   * @param {APIGatewayProxyEvent} event
   * @returns {Promise<APIGatewayProxyResult>}
   */
  @HandleExceptions()
  async login(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const REQ_BODY = JSON.parse(event.body as string);
    await UserValidator.checkLogin(REQ_BODY);

    const LOGIN_RESPONSE = await AUTH_SERVICE.login(REQ_BODY);

    return ResponseHandler.ok(LOGIN_RESPONSE);
  }
}
