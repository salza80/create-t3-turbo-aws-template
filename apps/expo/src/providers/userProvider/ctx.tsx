import type { ReactNode } from "react";
import React from "react";

import type { RouterOutputs, UseQueryResult } from "../trcpProvider";
import { api } from "../trcpProvider";

type UserData = RouterOutputs["user"]["me"];
const UserContext = React.createContext<UseQueryResult<UserData> | undefined>(
  undefined,
);

// This hook can be used to access the user info.
export function useUser() {
  const value = React.useContext<UseQueryResult<UserData> | undefined>(
    UserContext,
  );
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useUser must be wrapped in a <UserProvider />");
    }
  }

  return value;
}

export interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const response = api.user.me.useQuery(undefined, { refetchInterval: 2000 });

  return (
    <UserContext.Provider value={response}>{children}</UserContext.Provider>
  );
}
