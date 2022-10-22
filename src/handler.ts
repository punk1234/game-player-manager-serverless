import "reflect-metadata";

import Container from "typedi";
import {
  AuthApiHandler,
  GameApiHandler,
  GameplayScoreApiHandler,
  UserApiHandler,
} from "./handlers";

const AUTH_API_HANDLER = Container.get(AuthApiHandler);
const USER_API_HANDLER = Container.get(UserApiHandler);
const GAME_API_HANDLER = Container.get(GameApiHandler);
const GAMEPLAY_SCORE_API_HANDLER = Container.get(GameplayScoreApiHandler);

// AUTH HANDLERS
export const login = AUTH_API_HANDLER.login;
export const registerUser = AUTH_API_HANDLER.registerUser;

// USER HANDLERS
export const getMyProfile = USER_API_HANDLER.getMyProfile;
export const updateMyProfile = USER_API_HANDLER.updateMyProfile;
export const changeUsername = USER_API_HANDLER.changeUsername;

// GAME HANDLERS
export const createGame = GAME_API_HANDLER.createGame;
export const updateGame = GAME_API_HANDLER.updateGame;
export const getGames = GAME_API_HANDLER.getGames;
export const getGame = GAME_API_HANDLER.getGame;

// GAME-PLAY SCORES HANDLERS
export const submitGameplayScore = GAMEPLAY_SCORE_API_HANDLER.submitGameplayScore;
export const getGameplaysHighScores = GAMEPLAY_SCORE_API_HANDLER.getGameplaysHighScores;
