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

    // TODO: CHECK THAT USERNAME DOES NOT EXIST (probably GET by id & username)
    // await this.checkThatGameWithNameDoesNotExist(GAME.name);

    const updateData: UpdateGameDto = {};

    if (data.name) {
      updateData.name = data.name;
    }

    // data.name && (updateData.name = data.name); // USE SHORT FORM

    if (data.maxGamePlayScore) {
      updateData.maxGamePlayScore = data.maxGamePlayScore;
    }

    if (data.dailyMaxScoreSubmissionCount) {
      updateData.dailyMaxScoreSubmissionCount = data.dailyMaxScoreSubmissionCount;
    }

    if (data.description) {
      updateData.description = data.description;
    }

    // MOVE LINE OF CODE INTO AN HELPER CLASS (DUPLICATE IN USER-SERVICE UPDATE)
    const queryExprs: Array<string> = [];
    const exprValueMap: Record<string, any> = {};
    const updateExprNames: Record<string, any> = {};

    for (const [key, value] of Object.entries(data)) {
      queryExprs.push(`#${key} = :${key}`);
      exprValueMap[`:${key}`] = value;
      updateExprNames[`#${key}`] = key;
    }

    const UPDATED_GAME = await this.db.update<Game>(
      config.GAMES_TABLE,
      { id: gameId },
      queryExprs.join(", "),
      exprValueMap,
      updateExprNames,
    );

    return UPDATED_GAME;
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
      { "#name": "name" }
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
