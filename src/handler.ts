import "reflect-metadata";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { UserValidator, GameValidator, GameplayScoreValidator } from "./validators";
import { AuthService } from "./services/auth.service";
import { GameService } from "./services/game.service";
import Container from "typedi";
import { handleApiError, ResponseHandler, verifyAuthToken } from "./helpers";
import { IAuthTokenPayload } from "./interfaces";
import { UserService } from "./services/user.service";
import { GameplayScoreService } from "./services/game-play-score.service";
import { HandleExceptions } from "./decorators";
import { AuthApiHandler } from "./handlers";

const AUTH_SERVICE = Container.get(AuthService);
const USER_SERVICE = Container.get(UserService);
const GAME_SERVICE = Container.get(GameService);
const GAMEPLAY_SCORE_SERVICE = Container.get(GameplayScoreService);

const AUTH_API_HANDLER = Container.get(AuthApiHandler);


// AUTH HANDLERS
export const login = AUTH_API_HANDLER.login;
export const registerUser = AUTH_API_HANDLER.registerUser;

// let obj: any = {};
// for(let item of Object.getOwnPropertyNames(A.prototype)) {
//   obj[item] = A[item];
// }

// export { ...obj };


// @HandleExceptions()
// export const registerUser = HandleExceptions()((async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//   // try {
//     const REQ_BODY = JSON.parse(event.body as string);
//     await UserValidator.checkRegisterUser(REQ_BODY);

//     const USER = await AUTH_SERVICE.createUser(REQ_BODY);
//     return ResponseHandler.created(USER);
//   // } catch (err: any) {
//   //   return handleApiError(err);
//   // }
// }));

// export const login = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//   try {
//     const REQ_BODY = JSON.parse(event.body as string);
//     await UserValidator.checkLogin(REQ_BODY);

//     const USER = await AUTH_SERVICE.login(REQ_BODY);
//     return ResponseHandler.ok(USER);
//   } catch (err: any) {
//     return handleApiError(err);
//   }
// };

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

export const getMyProfile = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const AUTH_DATA: IAuthTokenPayload = verifyAuthToken(event.headers);
    const USER = await USER_SERVICE.getUser(AUTH_DATA.userId);

    return ResponseHandler.ok(USER);
  } catch (err: any) {
    return handleApiError(err);
  }
};

export const updateMyProfile = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const AUTH_DATA: IAuthTokenPayload = verifyAuthToken(event.headers);
    const REQ_BODY = JSON.parse(event.body as string);

    await UserValidator.checkUpdateProfile(REQ_BODY);
    const USER = await USER_SERVICE.updateUser(AUTH_DATA.userId, REQ_BODY);

    return ResponseHandler.ok(USER);
  } catch (err: any) {
    return handleApiError(err);
  }
};

export const changeUsername = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const AUTH_DATA: IAuthTokenPayload = verifyAuthToken(event.headers);
    const REQ_BODY = JSON.parse(event.body as string);

    await UserValidator.checkChangeUsername(REQ_BODY);
    const USER = await USER_SERVICE.changeUsername(AUTH_DATA.userId, REQ_BODY.username);

    return ResponseHandler.ok(USER);
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
