import * as React from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

type UseStateHook<T> = [[boolean, T | null], (value?: T | null) => void];

type State<T> = [boolean, T | null];

function useAsyncState<T>(
  initialValue: State<T> = [true, null],
): UseStateHook<T> {
  const reducer = (state: State<T>, action: T | null = null): State<T> => [
    false,
    action,
  ];
  return React.useReducer(reducer, initialValue) as UseStateHook<T>;
}

export async function setStorageItemAsync(key: string, value?: string | null) {
  if (Platform.OS === "web") {
    try {
      if (value === null || value === undefined) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    } catch (e) {
      console.error("Local storage is unavailable:", e);
    }
  } else {
    if (value == null) {
      await SecureStore.deleteItemAsync(key);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  }
}

export function useStorageState(key: string): UseStateHook<string> {
  // Public
  const [state, setState] = useAsyncState<string>();

  // Get
  React.useEffect(() => {
    if (Platform.OS === "web") {
      try {
        if (typeof localStorage !== "undefined") {
          setState(localStorage.getItem(key));
        }
      } catch (e) {
        console.error("Local storage is unavailable:", e);
      }
    } else {
      SecureStore.getItemAsync(key)
        .then((value) => {
          setState(value);
        })
        .catch((e) => console.log(e));
    }
  }, [key, setState]);

  // Set
  const setValue = React.useCallback(
    (value?: string | null) => {
      setStorageItemAsync(key, value)
        .then(() => {
          setState(value);
        })
        .catch((e) => console.log(e));
    },
    [key, setState],
  );

  return [state, setValue];
}
