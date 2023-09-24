"use client";

import { useCallback, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { SessionProvider, useSession } from "next-auth/react";
import superjson from "superjson";

import type { Session } from "@acme/auth";

import { env } from "~/env.mjs";
import { api } from "~/utils/api";

const getBaseUrl = () => {
  if (env.NEXT_PUBLIC_API_GATEWAY_URL) return env.NEXT_PUBLIC_API_GATEWAY_URL; // SSR should use api gateway url
  return null;
};

export function TRPCReactProvider(props: {
  children: React.ReactNode;
  headers?: Headers;
}) {
  const { data: session } = useSession();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 1000,
          },
        },
      }),
  );

  const trpcClient = useCallback(() => {
    return api.createClient({
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api`,
          headers() {
            const headers = new Map(props.headers);
            headers.set("x-trpc-source", "nextjs-react");
            // set authorization header
            if (session?.user?.accessToken) {
              console.log(session?.user?.accessToken);
              headers.set("authorization", session.user.accessToken);
            }
            return Object.fromEntries(headers);
          },
        }),
      ],
    });
  }, [session, props.headers]);

  return (
    <api.Provider client={trpcClient()} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryStreamedHydration transformer={superjson}>
          {props.children}
        </ReactQueryStreamedHydration>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </api.Provider>
  );
}

interface ISessionProviderProps {
  children: React.ReactNode;
  session: Session | null;
}

export const NextAuthSessionProvider = ({
  session,
  children,
}: ISessionProviderProps) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};
