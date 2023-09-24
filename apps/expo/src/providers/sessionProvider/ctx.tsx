import type { ReactNode } from "react";
import React, { useCallback } from "react";
import { Alert } from "react-native";
import { Redirect } from "expo-router";
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";

import { cognitoPool } from "../../utils/cognito";
import config from "../../utils/config";
import { useStorageState } from "./useStorageState";

export interface Session {
  idToken: string;
  accessToken: string;
  refreshToken: string;
}

const AuthContext = React.createContext<{
  register: (email: string, password: string, name: string) => void;
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  session?: Session | null;
  isLoading: boolean;
}>({
  register: () => undefined,
  signIn: () => undefined,
  signOut: () => undefined,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext);
  if (config.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export interface SessionProviderProps {
  children: ReactNode;
}
export function SessionProvider({ children }: SessionProviderProps) {
  const [[isRefreshTokenLoading, refreshToken], setRefreshToken] =
    useStorageState("refreshToken");
  const [[isIdTokenLoading, idToken], setIdToken] = useStorageState("idToken");
  const [[isAccessTokenLoading, accessToken], setAccessToken] =
    useStorageState("accessToken");

  const setSession = useCallback(
    (session: Session | null) => {
      setRefreshToken(session?.refreshToken);
      setIdToken(session?.idToken);
      setAccessToken(session?.accessToken);
    },
    [setAccessToken, setIdToken, setRefreshToken],
  );

  const isLoading =
    isRefreshTokenLoading || isIdTokenLoading || isAccessTokenLoading;

  const createSession = (): Session | null => {
    if (!isLoading && refreshToken && idToken && accessToken) {
      return {
        refreshToken,
        idToken,
        accessToken,
      };
    }
    return null;
  };

  const signIn = (email: string, password: string) => {
    const user = new CognitoUser({
      Username: email,
      Pool: cognitoPool,
    });

    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    user.authenticateUser(authDetails, {
      onSuccess: function (res) {
        const refreshToken = res?.getRefreshToken().getToken();
        const accessToken = res?.getAccessToken().getJwtToken();
        const idToken = res?.getIdToken().getJwtToken();

        setSession({ refreshToken, accessToken, idToken });
        return <Redirect href="/(tabs)/home" />;
      },
      onFailure: (err) => {
        if (err) {
          return Alert.alert("Error", err.message || "error signing in");
        }
      },
    });
  };

  const register = (email: string, name: string, password: string) => {
    const attributeList: CognitoUserAttribute[] = [];
    attributeList.push(new CognitoUserAttribute({ Name: "name", Value: name }));
    cognitoPool.signUp(email, password, attributeList, [], (err, data) => {
      if (err) {
        switch (err.name) {
          case "InvalidParameterException":
            return Alert.alert("Error", err.message);
          case "InvalidPasswordException":
            return Alert.alert("Error", err.message);
          case "UsernameExistsException":
            return Alert.alert("Error", "username already exists");
          default:
            return Alert.alert("Error", "error");
        }
      }
      Alert.alert("Registration Success", "Please confirm your email", [
        { text: "OK", onPress: () => <Redirect href="/(auth)/login" /> },
      ]);
    });
  };

  return (
    <AuthContext.Provider
      value={{
        register: register,
        signIn: signIn,
        signOut: () => {
          setSession(null);
        },
        session: createSession(),
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
