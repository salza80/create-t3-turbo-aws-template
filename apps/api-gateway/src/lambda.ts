import { awsLambdaRequestHandler } from "@trpc/server/adapters/aws-lambda";
import type { CreateAWSLambdaContextOptions } from "@trpc/server/adapters/aws-lambda";
import type { APIGatewayProxyEventV2 } from "aws-lambda";

import { appRouter, createTRPCContext } from "../../../packages/api";

export type AppRouter = typeof appRouter;

const createContext = ({
  event,
  context,
}: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>) => {
  console.log(context.awsRequestId);
  // can add info from context to if needed
  return createTRPCContext({
    event: event,
    apiVersion: (event as { version?: string }).version ?? "1.0",
  });
};

//type Context = trpc.inferAsyncReturnType<typeof createContext>;
export const handler = awsLambdaRequestHandler({
  router: appRouter,
  createContext,
});
