import { randomUUID } from "crypto";
import { Inject, Service } from "typedi";

import config from "../config";
import { GameService } from "./game.service";
import { DynamoDb } from "../database/adapters";
import { UnprocessableError } from "../exceptions";
import { Game, UserGameHighScore } from "../models";

@Service()
export class GameplayScoreService {
  // eslint-disable-next-line
  constructor(@Inject() private db: DynamoDb, @Inject() private gameService: GameService) {}

  /**
   * @method submitGameplayScore
   * @async
   * @param {string} userId
   * @param {string} gameId
   * @param {number} score
   * @returns {Promise<UserGameHighScore>}
   */
  async submitGameplayScore(userId: string, gameId: string, score: number): Promise<UserGameHighScore> {
    const GAME: Game = await this.gameService.checkThatGameExist(gameId);
    if (score > GAME.maxGamePlayScore) {
      throw new UnprocessableError(`Game score cannot be greater than ${GAME.maxGamePlayScore}`);
    }

    let USER_GAME_PLAY_DATA = await this.db.getItemByFilter<UserGameHighScore>(
      config.USER_GAME_HIGHSCORES_TABLE,
      "userId = :userId AND gameId = :gameId",
      { ":userId": userId, ":gameId": gameId },
    );

    if (USER_GAME_PLAY_DATA) {
      const { submissionCount, lastSubmittedAt } = USER_GAME_PLAY_DATA;
      if (
        submissionCount >= GAME.dailyMaxScoreSubmissionCount &&
        new Date(lastSubmittedAt).toISOString().slice(0, 10) == new Date().toISOString().slice(0, 10)
      ) {
        throw new UnprocessableError("Maximum submission reached. Kindly try later!");
      }

      const UPDATE_DATA = {
        lastSubmittedScore: score,
        lastSubmittedAt: new Date().toISOString(),
        highScore: Math.max(USER_GAME_PLAY_DATA.highScore, score),
        submissionCount: USER_GAME_PLAY_DATA.submissionCount + 1,
      };

      // MOVE LINE OF CODE INTO AN HELPER CLASS (DUPLICATE IN USER-SERVICE UPDATE)
      const queryExprs: Array<string> = [];
      const exprValueMap: Record<string, any> = {};

      for (const [key, value] of Object.entries(UPDATE_DATA)) {
        queryExprs.push(`${key} = :${key}`);
        exprValueMap[`:${key}`] = value;
      }

      return this.db.update<UserGameHighScore>(
        config.USER_GAME_HIGHSCORES_TABLE,
        { id: USER_GAME_PLAY_DATA.id },
        queryExprs.join(", "),
        exprValueMap,
      );
    }

    USER_GAME_PLAY_DATA = {
      id: randomUUID(),
      userId,
      gameId,
      lastSubmittedScore: score,
      lastSubmittedAt: new Date().toISOString(),
      highScore: score,
      submissionCount: 1,
    };

    await this.db.create(config.USER_GAME_HIGHSCORES_TABLE, USER_GAME_PLAY_DATA);
    return USER_GAME_PLAY_DATA;
  }

  /**
   * @method getGameplaysHighScores
   * @async
   * @param {string} userId
   * @returns {Promise<Array<UserGameHighScore>>}
   */
  async getGameplaysHighScores(userId: string): Promise<Array<UserGameHighScore>> {
    return this.db.getItemsByFilter<Array<UserGameHighScore>>(config.USER_GAME_HIGHSCORES_TABLE, "userId = :userId", {
      ":userId": userId,
    });
  }
}
