import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

class DynamoDB {
  private static instance: DynamoDBClient;

  static getInstance(): DynamoDBClient {
    if (!DynamoDB.instance) {
      DynamoDB.instance = new DynamoDBClient({
        region: process.env.AWS_REGION,
      });
    }

    return DynamoDB.instance;
  }
}
export { DynamoDB };
