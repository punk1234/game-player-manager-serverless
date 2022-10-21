import { randomUUID } from "crypto";
import { Inject, Service } from "typedi";

import config from "../config";
import { IUser } from "../interfaces";
import { UserValidator } from "../validators";
import { DynamoDb } from "../database/adapters";
import { CreateGameDto, Game, SubmitGameplayScoreDto, UpdateGameDto, UserGameHighScore } from "../models";
import { UserService } from "./user.service";
import { default as C } from "../constants";
import { JwtHelper, PasswordHasher } from "../helpers";
import { ConflictError, NotFoundError, UnauthenticatedError, UnprocessableError } from "../exceptions";
import { GameService } from "./game.service";


@Service()
export class GameplayScoreService {

  constructor(
    @Inject() private db: DynamoDb,
    @Inject() private gameService: GameService
  ) {}

  async submitGameplayScore(userId: string, gameId: string, score: number): Promise<UserGameHighScore> {
    const GAME: Game = await this.gameService.checkThatGameExist(gameId);
    if(score > GAME.maxGamePlayScore) {
      throw new UnprocessableError(`Game score cannot be greater than ${GAME.maxGamePlayScore}`);
    }

    let USER_GAME_PLAY_DATA = await this.db.getItemByFilter<UserGameHighScore>(
      config.USER_GAME_HIGHSCORES_TABLE,
      "userId = :userId AND gameId = :gameId",
      { ":userId": userId, ":gameId": gameId }
    );

    if(USER_GAME_PLAY_DATA) {
      if(USER_GAME_PLAY_DATA.submissionCount >= (GAME.dailyMaxScoreSubmissionCount || 0) // TODO: `|| 0` SHOULD BE REMOVED WHEN LIB IS UPDATED
        && new Date(USER_GAME_PLAY_DATA.lastSubmittedAt).toISOString().slice(0, 10) == new Date().toISOString().slice(0, 10)
      ) {
        throw new UnprocessableError("Maximum submission reached. Kindly try later!" + GAME.dailyMaxScoreSubmissionCount + "-" + JSON.stringify(GAME) + "-" + GAME.maxGamePlayScore);
      }
      
      const UPDATE_DATA = {
        lastSubmittedScore: score,
        lastSubmittedAt: new Date().toISOString(),
        highScore: Math.max(USER_GAME_PLAY_DATA.highScore, score),
        submissionCount: (USER_GAME_PLAY_DATA.submissionCount + 1)
      };

      // MOVE LINE OF CODE INTO AN HELPER CLASS (DUPLICATE IN USER-SERVICE UPDATE)
      let queryExprs: Array<string> = [], exprValueMap: Record<string, any> = {};

      for(const [key, value] of Object.entries(UPDATE_DATA)) {
        queryExprs.push(`${key} = :${key}`);
        exprValueMap[`:${key}`] = value;
      }

      return this.db.update<UserGameHighScore>(
        config.USER_GAME_HIGHSCORES_TABLE,
        { id: USER_GAME_PLAY_DATA.id },
        queryExprs.join(", "),
        exprValueMap
      );
    }

    USER_GAME_PLAY_DATA = {
        id: randomUUID(),
        userId,
        gameId,
        lastSubmittedScore: score,
        lastSubmittedAt: new Date().toISOString(),
        highScore: score,
        submissionCount: 1
    };

    await this.db.create<UserGameHighScore>(config.USER_GAME_HIGHSCORES_TABLE, USER_GAME_PLAY_DATA);
    return USER_GAME_PLAY_DATA;
    // }
  }

  async getGameplaysHighScores(userId: string): Promise<Array<UserGameHighScore>> {
    return this.db.getItemsByFilter<Array<UserGameHighScore>>(
      config.USER_GAME_HIGHSCORES_TABLE,
      "userId = :userId",
      { ":userId": userId }
    );
  }

//   async updateGame(gameId: string, data: UpdateGameDto): Promise<Game> {
//     const GAME = await this.checkThatGameExist(gameId);

//     // TODO: CHECK THAT USERNAME DOES NOT EXIST (probably GET by id & username)
//     // await this.checkThatGameWithNameDoesNotExist(GAME.name);

//     let updateData: UpdateGameDto = {};

//     if(data.name) {
//       updateData.name = data.name;
//     }

//     // data.name && (updateData.name = data.name); // USE SHORT FORM

//     if(data.maxGamePlayScore) {
//       updateData.maxGamePlayScore = data.maxGamePlayScore;
//     }

//     if(data.dailyMaxScoreSubmissionCount) {
//       updateData.dailyMaxScoreSubmissionCount = data.dailyMaxScoreSubmissionCount;
//     }

//     if(data.description) {
//       updateData.description = data.description;
//     }

//     // MOVE LINE OF CODE INTO AN HELPER CLASS (DUPLICATE IN USER-SERVICE UPDATE)
//     let queryExprs: Array<string> = [];
//     let exprValueMap: Record<string, any> = {}, updateExprNames: Record<string, any> = {};

//     for(const [key, value] of Object.entries(data)) {
//       queryExprs.push(`#${key} = :${key}`);
//       exprValueMap[`:${key}`] = value;
//       updateExprNames[`#${key}`] = key;
//     }

//     const UPDATED_GAME = await this.db.update<Game>(
//       config.GAMES_TABLE,
//       { id: gameId },
//       queryExprs.join(", "),
//       exprValueMap,
//       updateExprNames
//     );

//     return UPDATED_GAME;
//   }

//   async getGames(): Promise<Game[]> {
//     return this.db.getItemsByFilter<Game>(config.GAMES_TABLE)
//   }

//   async getGame(id: string): Promise<Game> {
//     return this.checkThatGameExist(id);
//   }

//   async getGameByName(name: string): Promise<Game> {
//     return this.db.getItemByFilter<Game>(
//       config.GAMES_TABLE,
//       "#name = :name",
//       { ":name": name },
//       { "#name": "name" }
//     );
//   }

//   private async checkThatGameExist(id: string): Promise<Game> {
//     const GAME = await this.db.getItemByKey<Game>(config.GAMES_TABLE, { id });

//     if(GAME) {
//       return GAME;
//     }

//     throw new NotFoundError("Game not found!");
//   }

//   private async checkThatGameWithNameDoesNotExist(gameName: string): Promise<void> {
//     const game = await this.getGameByName(gameName);

//     if(game) {
//       throw new ConflictError("Game already exist!");
//     }
//   }

}