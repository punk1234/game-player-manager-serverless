import AWS from "aws-sdk";
import { Service } from "typedi";
import {
  GetItemOutput,
  ScanOutput,
  UpdateExpression,
  UpdateItemOutput,
} from "aws-sdk/clients/dynamodb";

import { IDbAdapter, IDbQueryExpressions } from "../../interfaces";

@Service()
export class DynamoDb implements IDbAdapter {
  client = new AWS.DynamoDB.DocumentClient();

  /**
   * @method created
   * @async
   * @param {string} tableName
   * @param {*} data
   */
  async create(tableName: string, data: any): Promise<void> {
    await this.client
      .put({
        TableName: tableName,
        Item: data,
      })
      .promise();
  }

  /**
   * @method update
   * @async
   * @param {string} tableName
   * @param {Record<string, any>} key
   * @param {UpdateExpression} updateExpr
   * @param {Record<string, any>} exprAttrValueMap
   * @param {Record<string, any>} updateExprNames
   * @returns {Promise<T>}
   */
  async update<T>(
    tableName: string,
    key: Record<string, any>,
    updateExpr?: UpdateExpression,
    exprAttrValueMap?: Record<string, any>,
    updateExprNames?: Record<string, any>,
  ): Promise<T> {
    const output: UpdateItemOutput = await this.client
      .update({
        TableName: tableName,
        Key: key,
        UpdateExpression: updateExpr && `SET ${updateExpr}`,
        ExpressionAttributeValues: exprAttrValueMap,
        ExpressionAttributeNames: updateExprNames,
        ReturnValues: "ALL_NEW",
      })
      .promise();

    return output.Attributes as unknown as T;
  }

  /**
   * @method getItemByKey
   * @async
   * @param {string} tableName
   * @param {*} queryOpts
   * @returns {Promise<any>}
   */
  async getItemByKey<T>(tableName: string, queryOpts: any): Promise<any> {
    const output: GetItemOutput = await this.client
      .get({
        TableName: tableName,
        Key: { ...queryOpts },
      })
      .promise();

    return output.Item as T | undefined;
  }

  /**
   * @method getItemsByFilter
   * @async
   * @param {string} tableName
   * @param {string} filterExpression
   * @param {Record<string, any>} filterKeyValues
   * @param {Record<string, any>} filterExprNames
   * @returns {Promise<any[]>}
   */
  async getItemsByFilter<T>(
    tableName: string,
    filterExpression?: string,
    filterKeyValues?: Record<string, any>,
    filterExprNames?: Record<string, any>,
  ): Promise<any[]> {
    const output: ScanOutput = await this.client
      .scan({
        TableName: tableName,
        FilterExpression: filterExpression,
        ExpressionAttributeValues: filterKeyValues,
        ExpressionAttributeNames: filterExprNames,
      })
      .promise();

    return output.Items || ([] as T[]);
  }

  /**
   * @method getItemByFilter
   * @async
   * @param {string} tableName
   * @param {string} filterExpression
   * @param {Record<string, any>} filterKeyValues
   * @param {Record<string, any>} filterExprNames
   * @returns {Promise<T>}
   */
  async getItemByFilter<T>(
    tableName: string,
    filterExpression: string,
    filterKeyValues: Record<string, any>,
    filterExprNames?: Record<string, any>,
  ): Promise<T> {
    const items: any[] = await this.getItemsByFilter<T>(
      tableName,
      filterExpression,
      filterKeyValues,
      filterExprNames,
    );

    return items[0] as T;
  }

  /**
   * @method generateQuery
   * @param {Record<string, any>} queryKeyValuePair
   * @returns {IDbQueryExpressions}
   */
  generateQuery(queryKeyValuePair: Record<string, any>): IDbQueryExpressions {
    const queryExprs: Array<string> = [];
    const exprValueMap: Record<string, any> = {};

    for (const [key, value] of Object.entries(queryKeyValuePair)) {
      queryExprs.push(`${key} = :${key}`);
      exprValueMap[`:${key}`] = value;
    }

    return {
      queryExprs: queryExprs.join(", "),
      exprValueMap,
    };
  }

  /**
   * @method generateQueryWithKeyword
   * @param {Record<string, any>} queryKeyValuePair
   * @returns {IDbQueryExpressions}
   */
  generateQueryWithKeyword(queryKeyValuePair: Record<string, any>): IDbQueryExpressions {
    const queryExprs: Array<string> = [];
    const exprValueMap: Record<string, any> = {};
    const updateExprNames: Record<string, any> = {};

    for (const [key, value] of Object.entries(queryKeyValuePair)) {
      queryExprs.push(`#${key} = :${key}`);
      exprValueMap[`:${key}`] = value;
      updateExprNames[`#${key}`] = key;
    }

    return {
      queryExprs: queryExprs.join(", "),
      exprValueMap,
      updateExprNames,
    };
  }
}
