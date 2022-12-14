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
  async submitGameplayScore(
    userId: string,
    gameId: string,
    score: number,
  ): Promise<UserGameHighScore> {
    const GAME: Game = await this.gameService.checkThatGameExist(gameId);

    if (score > GAME.maxGamePlayScore) {
      throw new UnprocessableError(`Game score cannot be greater than ${GAME.maxGamePlayScore}`);
    }

    let USER_GAME_PLAY_DATA = await this.getUserGameScoreRecord(userId, gameId);

    if (USER_GAME_PLAY_DATA) {
      return this.updateUserGameScoreRecord(USER_GAME_PLAY_DATA, GAME, score);
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
    return this.db.getItemsByFilter<Array<UserGameHighScore>>(
      config.USER_GAME_HIGHSCORES_TABLE,
      "userId = :userId",
      {
        ":userId": userId,
      },
    );
  }

  /**
   * @method getUserGameScoreRecord
   * @param {string} userId
   * @param {string} gameId
   * @returns {Promise<UserGameHighScore>}
   */
  getUserGameScoreRecord(userId: string, gameId: string): Promise<UserGameHighScore> {
    return this.db.getItemByFilter<UserGameHighScore>(
      config.USER_GAME_HIGHSCORES_TABLE,
      "userId = :userId AND gameId = :gameId",
      { ":userId": userId, ":gameId": gameId },
    );
  }

  /**
   * @method updateUserGameScoreRecord
   * @async
   * @param {UserGameHighScore} userGameplayData
   * @param {Game} game
   * @param {number} score
   * @returns {Promise<UserGameHighScore>}
   */
  async updateUserGameScoreRecord(
    userGameplayData: UserGameHighScore,
    game: Game,
    score: number,
  ): Promise<UserGameHighScore> {
    if (userGameplayData.submissionCount >= game.dailyMaxScoreSubmissionCount) {
      if (
        new Date(userGameplayData.lastSubmittedAt).toISOString().slice(0, 10) ==
        new Date().toISOString().slice(0, 10)
      ) {
        throw new UnprocessableError("Maximum submission reached. Kindly try later!");
      }

      userGameplayData.submissionCount = 0;
    }

    const UPDATE_DATA = {
      lastSubmittedScore: score,
      lastSubmittedAt: new Date().toISOString(),
      highScore: Math.max(userGameplayData.highScore, score),
      submissionCount: userGameplayData.submissionCount + 1,
    };

    const DB_UPDATE_EXPRESSIONS = this.db.generateQuery(UPDATE_DATA);

    return this.db.update<UserGameHighScore>(
      config.USER_GAME_HIGHSCORES_TABLE,
      { id: userGameplayData.id },
      DB_UPDATE_EXPRESSIONS.queryExprs,
      DB_UPDATE_EXPRESSIONS.exprValueMap,
    );
  }
}
