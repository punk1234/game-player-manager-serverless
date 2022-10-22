import "reflect-metadata";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { GameValidator, GameplayScoreValidator } from "./validators";
import { GameService } from "./services/game.service";
import Container from "typedi";
import { handleApiError, ResponseHandler, verifyAuthToken } from "./helpers";
import { IAuthTokenPayload } from "./interfaces";
import { GameplayScoreService } from "./services/game-play-score.service";
import { AuthApiHandler, UserApiHandler } from "./handlers";

const GAME_SERVICE = Container.get(GameService);
const GAMEPLAY_SCORE_SERVICE = Container.get(GameplayScoreService);

const AUTH_API_HANDLER = Container.get(AuthApiHandler);
const USER_API_HANDLER = Container.get(UserApiHandler);

// AUTH HANDLERS
export const login = AUTH_API_HANDLER.login;
export const registerUser = AUTH_API_HANDLER.registerUser;

// USER HANDLERS
export const getMyProfile = USER_API_HANDLER.getMyProfile;
export const updateMyProfile = USER_API_HANDLER.updateMyProfile;
export const changeUsername = USER_API_HANDLER.changeUsername;



export const createGame = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const REQ_BODY = JSON.parse(event.body as string);
    await GameValidator.checkCreateGame(REQ_BODY);

    const USER = await GAME_SERVICE.createGame(REQ_BODY);
    return ResponseHandler.created(USER);
  } catch (err: any) {
    return handleApiError(err);
  }
};

export const updateGame = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const GAME_ID: string = event.pathParameters?.gameId as string; // WHAT THIS IS UNDEFINED
    const REQ_BODY = JSON.parse(event.body as string);

    await GameValidator.checkUpdateGame({ ...REQ_BODY, gameId: GAME_ID });
    const GAME = await GAME_SERVICE.updateGame(GAME_ID, REQ_BODY);

    return ResponseHandler.ok(GAME);
  } catch (err: any) {
    return handleApiError(err);
  }
};

export const getGames = async (): Promise<APIGatewayProxyResult> => {
  try {
    const GAMES = await GAME_SERVICE.getGames();
    return ResponseHandler.ok(GAMES);
  } catch (err: any) {
    return handleApiError(err);
  }
};

export const getGame = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    await GameValidator.checkGetGame(event.pathParameters); // WHAT IF undefined

    const GAME = await GAME_SERVICE.getGame(event.pathParameters?.gameId as string);
    return ResponseHandler.ok(GAME);
  } catch (err: any) {
    return handleApiError(err);
  }
};

export const submitGameplayScore = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const AUTH_DATA: IAuthTokenPayload = verifyAuthToken(event.headers);
    const REQ_BODY = JSON.parse(event.body as string);

    await GameplayScoreValidator.checkScoreSubmission(REQ_BODY);
    const USER_GAMEPLAY_SCORE = await GAMEPLAY_SCORE_SERVICE.submitGameplayScore(
      AUTH_DATA.userId,
      REQ_BODY.gameId,
      REQ_BODY.score,
    );

    return ResponseHandler.ok(USER_GAMEPLAY_SCORE);
  } catch (err: any) {
    return handleApiError(err);
  }
};

export const getGameplaysHighScores = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const AUTH_DATA: IAuthTokenPayload = verifyAuthToken(event.headers);
    const USER_GAMEPLAY_HIGHSCORES = await GAMEPLAY_SCORE_SERVICE.getGameplaysHighScores(AUTH_DATA.userId);

    return ResponseHandler.ok(USER_GAMEPLAY_HIGHSCORES);
  } catch (err: any) {
    return handleApiError(err);
  }
};
