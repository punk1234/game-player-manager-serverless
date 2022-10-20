import AWS from "aws-sdk";
import { Service } from "typedi";
import { GetItemOutput, PutItemOutput, ScanOutput, UpdateExpression, UpdateItemOutput } from "aws-sdk/clients/dynamodb";

import { IDbAdapter } from "../../interfaces";

@Service()
export class DynamoDb implements IDbAdapter {

    client = new AWS.DynamoDB.DocumentClient();
    
    async create<T>(tableName: string, data: any): Promise<void> {
      const output: PutItemOutput = await this.client.put({
        TableName: tableName,
        Item: data,
      }).promise();
    }

    async update<T>(
      tableName: string,
      key: Record<string, any>,
      updateExpr?: UpdateExpression,
      exprAttrValueMap?: Record<string, any>,
      updateExprNames?: Record<string, any>
    ): Promise<T> {

      const output: UpdateItemOutput = await this.client.update({
        TableName: tableName,
        Key: key,
        UpdateExpression: updateExpr && `SET ${updateExpr}`,
        ExpressionAttributeValues: exprAttrValueMap,
        ExpressionAttributeNames: updateExprNames,
        ReturnValues: "ALL_NEW"
      }).promise();

      return output.Attributes as unknown as T;
    }

    async getItemByKey<T>(tableName: string, queryOpts: any): Promise<any> {
      const output: GetItemOutput = await this.client.get({
        TableName: tableName,
        Key: { ...queryOpts },
      }).promise();

      return output.Item as T|undefined;
    }

    async getItemsByFilter<T>(
      tableName: string,
      filterExpression?: string,
      filterKeyValues?: Record<string, any>,
      filterExprNames?: Record<string, any>
    ): Promise<any[]> {

      const output: ScanOutput = await this.client.scan({
        TableName: tableName,
        FilterExpression: filterExpression,
        ExpressionAttributeValues: filterKeyValues,
        ExpressionAttributeNames: filterExprNames
      }).promise();
  
      return output.Items || [] as T[];
    }

    async getItemByFilter<T>(
      tableName: string,
      filterExpression: string,
      filterKeyValues: Record<string, any>,
      filterExprNames?: Record<string, any>
    ): Promise<T> {
      const items: any[] = await this.getItemsByFilter<T>(tableName, filterExpression, filterKeyValues, filterExprNames);
    
      return items[0] as T;
    }

}