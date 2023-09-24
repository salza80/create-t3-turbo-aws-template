import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.string(),
  COGNITO_USER_POOL_ID: z.string(),
  COGNITO_CLIENT_ID: z.string(),
  COGNITO_API_URL: z.string(),
});

export default EnvSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  COGNITO_USER_POOL_ID: process.env.EXPO_PUBLIC_COGNITO_USER_POOL_ID,
  COGNITO_CLIENT_ID: process.env.EXPO_PUBLIC_COGNITO_CLIENT_ID,
  COGNITO_API_URL: process.env.EXPO_PUBLIC_COGNITO_API_URL,
});
