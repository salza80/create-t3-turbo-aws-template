import type { DefaultSession } from "@auth/core/types";
import NextAuth from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";

import { env } from "./env.mjs";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & { accessToken: string };
  }
}

export type { Session } from "next-auth";

// Update this whenever adding new providers so that the client can
export const providers = ["cognito"] as const;
export type OAuthProviders = (typeof providers)[number];

export const {
  handlers: { GET, POST },
  auth,
  CSRF_experimental,
} = NextAuth({
  providers: [
    CognitoProvider({
      clientId: env.COGNITO_CLIENT_ID,
      issuer: env.COGNITO_ISSUER,
      client: {
        token_endpoint_auth_method: "none",
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, account }) => {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        accessToken: token.accessToken,
      },
    }),
    // @TODO
    // authorized({ request, auth }) {
    //   return !!auth?.user
    // }
  },
});
