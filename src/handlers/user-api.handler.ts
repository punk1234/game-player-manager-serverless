import { Service, Container } from "typedi";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { UserValidator } from "../validators";
import { HandleExceptions } from "../decorators";
import { IAuthTokenPayload } from "../interfaces";
import { UserService } from "../services/user.service";
import { ResponseHandler, verifyAuthToken } from "../helpers";

const USER_SERVICE = Container.get(UserService);

@Service()
export class UserApiHandler {
  /**
   * @method getMyProfile
   * @async
   * @param {APIGatewayProxyEvent} event
   * @returns {Promise<APIGatewayProxyResult>}
   */
  @HandleExceptions()
  async getMyProfile(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const AUTH_DATA: IAuthTokenPayload = verifyAuthToken(event.headers);
    const USER = await USER_SERVICE.getUser(AUTH_DATA.userId);

    return ResponseHandler.ok(USER);
  }

  /**
   * @method updateMyProfile
   * @async
   * @param {APIGatewayProxyEvent} event
   * @returns {Promise<APIGatewayProxyResult>}
   */
  @HandleExceptions()
  async updateMyProfile(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const AUTH_DATA: IAuthTokenPayload = verifyAuthToken(event.headers);
    const REQ_BODY = JSON.parse(event.body as string);

    await UserValidator.checkUpdateProfile(REQ_BODY);
    const USER = await USER_SERVICE.updateUser(AUTH_DATA.userId, REQ_BODY);

    return ResponseHandler.ok(USER);
  }

  /**
   * @method changeUsername
   * @async
   * @param {APIGatewayProxyEvent} event
   * @returns {Promise<APIGatewayProxyResult>}
   */
  @HandleExceptions()
  async changeUsername(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const AUTH_DATA: IAuthTokenPayload = verifyAuthToken(event.headers);
    const REQ_BODY = JSON.parse(event.body as string);

    await UserValidator.checkChangeUsername(REQ_BODY);

    const USER = await USER_SERVICE.changeUsername(AUTH_DATA.userId, REQ_BODY.username);
    return ResponseHandler.ok(USER);
  }
}
