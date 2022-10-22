import { Service, Container } from "typedi";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { HandleExceptions } from "../decorators";
import { IAuthTokenPayload } from "../interfaces";
import { GameplayScoreValidator } from "../validators";
import { ResponseHandler, verifyAuthToken } from "../helpers";
import { GameplayScoreService } from "../services/game-play-score.service";

const GAMEPLAY_SCORE_SERVICE = Container.get(GameplayScoreService);

@Service()
export class GameplayScoreApiHandler {
  /**
   * @method submitGameplayScore
   * @param {APIGatewayProxyEvent} event
   * @returns {Promise<APIGatewayProxyResult>}
   */
  @HandleExceptions()
  async submitGameplayScore(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const AUTH_DATA: IAuthTokenPayload = verifyAuthToken(event.headers);
    const REQ_BODY = JSON.parse(event.body as string);

    await GameplayScoreValidator.checkScoreSubmission(REQ_BODY);

    const USER_GAMEPLAY_SCORE = await GAMEPLAY_SCORE_SERVICE.submitGameplayScore(
      AUTH_DATA.userId,
      REQ_BODY.gameId,
      REQ_BODY.score,
    );

    return ResponseHandler.ok(USER_GAMEPLAY_SCORE);
  }

  /**
   * @method getGameplaysHighScores
   * @param {APIGatewayProxyEvent} event
   * @returns {Promise<APIGatewayProxyResult>}
   */
  @HandleExceptions()
  async getGameplaysHighScores(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const AUTH_DATA: IAuthTokenPayload = verifyAuthToken(event.headers);
    const USER_GAMEPLAY_HIGHSCORES = await GAMEPLAY_SCORE_SERVICE.getGameplaysHighScores(AUTH_DATA.userId);

    return ResponseHandler.ok(USER_GAMEPLAY_HIGHSCORES);
  }
}
