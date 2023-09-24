import type { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  CreateTableCommand,
  DeleteItemCommand,
  DescribeTableCommand,
  GetItemCommand,
  PutItemCommand,
  ResourceNotFoundException,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

interface Model {
  id: string;
}

abstract class BaseModel<T extends Model> {
  private readonly dynamoDB: DynamoDBClient;
  private tableName: string;

  constructor(dynamoDB: DynamoDBClient, tableName: string) {
    this.dynamoDB = dynamoDB;
    this.tableName = tableName;

    // Ensure the table exists during class instantiation
    this.ensureTableExists().catch((error) => {
      console.error("Error creating table:", error);
      throw error;
    });
  }

  private async ensureTableExists(): Promise<void> {
    const describeTableCommand = new DescribeTableCommand({
      TableName: this.tableName,
    });

    try {
      // Check if the table exists
      await this.dynamoDB.send(describeTableCommand);
    } catch (error) {
      // Table does not exist, create it
      if (error instanceof ResourceNotFoundException) {
        const createTableCommand = new CreateTableCommand({
          TableName: this.tableName,
          KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
          AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
        });

        await this.dynamoDB.send(createTableCommand);
      } else {
        throw error;
      }
    }
  }

  async get(id: string): Promise<T | null> {
    const getItemCommand = new GetItemCommand({
      TableName: this.tableName,
      Key: marshall({ id }),
    });

    try {
      const result = await this.dynamoDB.send(getItemCommand);
      if (result.Item) {
        return unmarshall(result.Item) as T;
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Error fetching ${this.tableName}:`, error);
      throw error;
    }
  }

  async create(item: T): Promise<void> {
    const putItemCommand = new PutItemCommand({
      TableName: this.tableName,
      Item: marshall(item),
    });

    try {
      await this.dynamoDB.send(putItemCommand);
    } catch (error) {
      console.error(`Error creating ${this.tableName}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    const deleteItemCommand = new DeleteItemCommand({
      TableName: this.tableName,
      Key: marshall({ id }),
    });

    try {
      await this.dynamoDB.send(deleteItemCommand);
    } catch (error) {
      console.error(`Error deleting ${this.tableName}:`, error);
      throw error;
    }
  }

  async update(id: string, updatedItemData: Partial<T>): Promise<void> {
    const updateExpression: string[] = [];
    const expressionAttributeValues = new Map<string, unknown>();

    for (const key in updatedItemData) {
      if (Object.prototype.hasOwnProperty.call(updatedItemData, key)) {
        updateExpression.push(`#${key} = :${key}`);
        expressionAttributeValues.set(
          `:${key}`,
          Object.call(updatedItemData, key),
        );
        expressionAttributeValues.set(`#${key}`, key);
      }
    }

    const updateItemCommand = new UpdateItemCommand({
      TableName: this.tableName,
      Key: marshall({ id }),
      UpdateExpression: `SET ${updateExpression.join(", ")}`,
      ExpressionAttributeValues: marshall(
        Object.fromEntries(expressionAttributeValues.entries()),
      ),
      ReturnValues: "NONE",
    });

    try {
      await this.dynamoDB.send(updateItemCommand);
    } catch (error) {
      console.error(`Error updating ${this.tableName}:`, error);
      throw error;
    }
  }
}

export { BaseModel };
