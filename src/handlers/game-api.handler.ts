import { Service, Container } from "typedi";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { GameValidator } from "../validators";
import { HandleExceptions } from "../decorators";
import { IAuthTokenPayload } from "../interfaces";
import { GameService } from "../services/game.service";
import { ResponseHandler, RoleAccess, verifyAuthToken } from "../helpers";

const GAME_SERVICE = Container.get(GameService);

@Service()
export class GameApiHandler {
  /**
   * @method createGame
   * @param {APIGatewayProxyEvent} event
   * @returns {Promise<APIGatewayProxyResult>}
   */
  @HandleExceptions()
  async createGame(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const AUTH_DATA: IAuthTokenPayload = verifyAuthToken(event.headers);
    RoleAccess.checkThatUserIsAuthorized(AUTH_DATA.isAdmin);

    const REQ_BODY = JSON.parse(event.body as string);
    await GameValidator.checkCreateGame(REQ_BODY);

    const GAME = await GAME_SERVICE.createGame(REQ_BODY);
    return ResponseHandler.created(GAME);
  }

  /**
   * @method updateGame
   * @param {APIGatewayProxyEvent} event
   * @returns {Promise<APIGatewayProxyResult>}
   */
  @HandleExceptions()
  async updateGame(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const AUTH_DATA: IAuthTokenPayload = verifyAuthToken(event.headers);
    RoleAccess.checkThatUserIsAuthorized(AUTH_DATA.isAdmin);

    const GAME_ID: string = event.pathParameters?.gameId as string; // WHAT IF THIS IS `undefined`
    const REQ_BODY = JSON.parse(event.body as string);

    await GameValidator.checkUpdateGame({ ...REQ_BODY, gameId: GAME_ID });
    const GAME = await GAME_SERVICE.updateGame(GAME_ID, REQ_BODY);

    return ResponseHandler.ok(GAME);
  }

  /**
   * @method getGames
   * @param {APIGatewayProxyEvent} event
   * @returns {Promise<APIGatewayProxyResult>}
   */
  @HandleExceptions()
  // eslint-disable-next-line
  async getGames(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const GAMES = await GAME_SERVICE.getGames();

    return ResponseHandler.ok(GAMES);
  }

  /**
   * @method getGame
   * @param {APIGatewayProxyEvent} event
   * @returns {Promise<APIGatewayProxyResult>}
   */
  @HandleExceptions()
  async getGame(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    await GameValidator.checkGetGame(event.pathParameters); // WHAT IF THIS IS `undefined`

    const GAME = await GAME_SERVICE.getGame(event.pathParameters?.gameId as string);

    return ResponseHandler.ok(GAME);
  }
}
