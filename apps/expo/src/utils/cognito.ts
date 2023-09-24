import { CognitoUserPool } from "amazon-cognito-identity-js";

import config from "./config";

const poolData = {
  UserPoolId: config.COGNITO_USER_POOL_ID,
  ClientId: config.COGNITO_CLIENT_ID,
};
export const cognitoPool = new CognitoUserPool(poolData);
