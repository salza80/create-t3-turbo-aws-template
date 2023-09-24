/* eslint-disable @typescript-eslint/require-await */
import type { Handler } from "aws-lambda";

export const handler: Handler = async () => {
  // This is the cors headers.
  // set to allow localhost to call the api gateway
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Methods": "*",
    },
    body: JSON.stringify("CORS for Dev"),
  };
  return response;
};
