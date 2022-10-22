import { randomUUID } from "crypto";
import { Inject, Service } from "typedi";

import config from "../config";
import { DynamoDb } from "../database/adapters";
import { ConflictError, NotFoundError } from "../exceptions";
import { CreateGameDto, Game, UpdateGameDto } from "../models";

@Service()
export class GameService {
  // eslint-disable-next-line
  constructor(@Inject() private db: DynamoDb) {}

  /**
   * @method createGame
   * @async
   * @param {CreateGameDto} data
   * @returns {Promise<Game>}
   */
  async createGame(data: CreateGameDto): Promise<Game> {
    await this.checkThatGameWithNameDoesNotExist(data.name);

    const GAME_TO_CREATE: Game = { ...data, id: randomUUID() };
    await this.db.create(config.GAMES_TABLE, GAME_TO_CREATE);

    return GAME_TO_CREATE;
  }

  /**
   * @method updateGame
   * @async
   * @param {string} gameId
   * @param {UpdateGameDto} data
   * @returns {Promise<Game>}
   */
  async updateGame(gameId: string, data: UpdateGameDto): Promise<Game> {
    await this.checkThatGameExist(gameId);
    await this.checkThatGameNameCanBeUpdated(data.name, gameId);

    const updateData: UpdateGameDto = {};

    data.name && (updateData.name = data.name);
    data.description && (updateData.description = data.description);
    data.maxGamePlayScore && (updateData.maxGamePlayScore = data.maxGamePlayScore);

    if (data.dailyMaxScoreSubmissionCount) {
      updateData.dailyMaxScoreSubmissionCount = data.dailyMaxScoreSubmissionCount;
    }

    const DB_UPDATE_EXPRESSIONS = this.db.generateQueryWithKeyword(updateData);

    const UPDATED_GAME = await this.db.update<Game>(
      config.GAMES_TABLE,
      { id: gameId },
      DB_UPDATE_EXPRESSIONS.queryExprs,
      DB_UPDATE_EXPRESSIONS.exprValueMap,
      DB_UPDATE_EXPRESSIONS.updateExprNames,
    );

    return UPDATED_GAME;
  }

  /**
   * @method checkThatGameNameCanBeUpdated
   * @async
   * @param {string|undefined} gameName 
   * @param {string} gameId 
   * @returns {Promise<void>}
   */
  async checkThatGameNameCanBeUpdated(gameName: string|undefined, gameId: string): Promise<void> {
    if(!gameName) {
      return;
    }

    const GAME_BY_NAME = await this.getGameByName(gameName);

    if(GAME_BY_NAME?.name && GAME_BY_NAME.id !== gameId) {
      throw new ConflictError(`Game with name ${GAME_BY_NAME.name} already exist!`);
    }
  }

  /**
   * @method getGames
   * @returns {Promise<Game[]>}
   */
  getGames(): Promise<Game[]> {
    return this.db.getItemsByFilter<Game>(config.GAMES_TABLE);
  }

  /**
   * @method getGame
   * @async
   * @param {string} id
   * @returns {Promise<Game>}
   */
  async getGame(id: string): Promise<Game> {
    return this.checkThatGameExist(id);
  }

  /**
   * @method getGameByName
   * @param {string} name
   * @returns {Promise<Game>}
   */
  getGameByName(name: string): Promise<Game> {
    return this.db.getItemByFilter<Game>(
      config.GAMES_TABLE,
      "#name = :name",
      { ":name": name },
      { "#name": "name" },
    );
  }

  /**
   * @method checkThatGameExist
   * @async
   * @param {string} id
   * @returns {Promise<Game>}
   */
  async checkThatGameExist(id: string): Promise<Game> {
    const GAME = await this.db.getItemByKey<Game>(config.GAMES_TABLE, { id });

    if (GAME) {
      return GAME;
    }

    throw new NotFoundError("Game not found!");
  }

  /**
   * @method checkThatGameWithNameDoesNotExist
   * @async
   * @param {string} gameName
   */
  private async checkThatGameWithNameDoesNotExist(gameName: string): Promise<void> {
    const game = await this.getGameByName(gameName);

    if (game) {
      throw new ConflictError("Game already exist!");
    }
  }
}
