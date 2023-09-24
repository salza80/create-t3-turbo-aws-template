import type { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import { BaseModel } from "./Base";

export interface QuoteCard {
  id: number;
  cardType: string;
  author: string;
  text: string;
}

export interface User {
  id: string;
  name: string;
  emailAddress: string;
  nextCards?: QuoteCard[];
}

class UserModel extends BaseModel<User> {
  constructor(dynamoDB: DynamoDBClient, tableName: string) {
    super(dynamoDB, tableName);
  }
}

export { UserModel };
