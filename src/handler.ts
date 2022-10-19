import "reflect-metadata";

import AWS from "aws-sdk";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { UserValidator, GameValidator } from "./validators";
import { AuthService } from "./services/auth.service";
import { GameService } from "./services/game.service";
import Container from "typedi";
import { handleApiError, ResponseHandler, verifyAuthToken } from "./helpers";
import { IAuthTokenPayload } from "./interfaces";
import { UserService } from "./services/user.service";

// const USERS_TABLE = process.env.USERS_TABLE as string;
// const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

const AUTH_SERVICE = Container.get(AuthService);
const USER_SERVICE = Container.get(UserService);
const GAME_SERVICE = Container.get(GameService);

export const registerUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try { // event.headers["authorization"]
    const REQ_BODY = JSON.parse(event.body as string);
    await UserValidator.checkRegisterUser(REQ_BODY);

    const USER = await AUTH_SERVICE.createUser(REQ_BODY);
    return ResponseHandler.created(USER);
  } catch (err: any) {
    return handleApiError(err);
  }
};

export const login = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const REQ_BODY = JSON.parse(event.body as string);
    await UserValidator.checkLogin(REQ_BODY);

    const USER = await AUTH_SERVICE.login(REQ_BODY);
    return ResponseHandler.ok(USER);
  } catch (err: any) {
    return handleApiError(err);
  }
};

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

    await GameValidator.checkUpdateGame({ gameId: GAME_ID, ...REQ_BODY });
    const GAME = await GAME_SERVICE.updateGame(GAME_ID, REQ_BODY);

    return ResponseHandler.ok(GAME);
  } catch (err: any) {
    return handleApiError(err);
  }
};

export const getGames = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
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