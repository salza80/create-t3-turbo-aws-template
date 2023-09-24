import type { StackContext } from "sst/constructs";
import { Api, Cognito, Table } from "sst/constructs";

export function API({ stack }: StackContext) {
  const userTable = new Table(stack, "Users", {
    fields: {
      id: "string",
      email: "string",
    },
    primaryIndex: { partitionKey: "id" },
  });

  const auth = new Cognito(stack, "Auth", {
    login: ["email"],
  });

  const api = new Api(stack, "api", {
    cors: {
      allowMethods: ["ANY"],
      allowHeaders: ["*"],
      allowOrigins: ["http://localhost:3000"],
    },
    authorizers: {
      jwt: {
        type: "user_pool",
        userPool: {
          id: auth.userPoolId,
          clientIds: [auth.userPoolClientId],
        },
      },
    },
    defaults: {
      authorizer: "jwt",
    },
    routes: {
      "OPTIONS /api/{proxy+}": {
        authorizer: "none",
        function: {
          handler: "src/optionsLambda.handler",
          environment: {
            COGNITO_USER_POOL_ID: auth.userPoolId,
            COGNITO_CLIENT_ID: auth.userPoolClientId,
            TABLE_USERS: userTable.tableName,
          },
          bind: [userTable],
        },
      },
      "ANY /api/{proxy+}": {
        function: {
          handler: "src/lambda.handler",
          environment: {
            COGNITO_USER_POOL_ID: auth.userPoolId,
            COGNITO_CLIENT_ID: auth.userPoolClientId,
            TABLE_USERS: userTable.tableName,
          },
          bind: [userTable],
        },
      },
    },
  });

  // OPTIONS route defined individully to allow CORS to work. you just use the ANY route otherwise
  //https://aws.amazon.com/blogs/compute/configuring-cors-on-amazon-api-gateway-apis/

  auth.attachPermissionsForAuthUsers(stack, [api]);

  stack.addOutputs({
    ApiEndpoint: api.url,
    UserPoolId: auth.userPoolId,
    IdentityPoolId: auth.cognitoIdentityPoolId,
    UserPoolClientId: auth.userPoolClientId,
  });
}
