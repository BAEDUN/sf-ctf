import React, {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  PropsWithChildren,
  useContext,
} from "react";

export interface IAuthContext {
  token: string;
  // nickname: string;
  // username: string;
}

export const AuthContext = createContext<{
  auth: IAuthContext | null;
  setAuth: Dispatch<SetStateAction<IAuthContext | null>>;
}>({
  auth: null,
  setAuth: () => null,
});

export function AuthProvider(props: PropsWithChildren<{}>) {
  const [auth, setAuth] = useState<IAuthContext | null>(null);
  return <AuthContext.Provider value={{ auth, setAuth }} {...props} />;
}

export function useAuthContext() {
  return useContext(AuthContext);
}

const AUTH_CONTEXT_KEY = "AUTH_CONTEXT_KEY";
export function tryLoadAuthContextFromLocalStorage(): IAuthContext | null {
  try {
    const authContext = JSON.parse(
      localStorage.getItem(AUTH_CONTEXT_KEY) || ""
    );
    const token = authContext?.token;
    if (!token) {
      return null;
    }
    return {
      token,
    };
  } catch {
    return null;
  }
}
export function removeAuthContextFromLocalStorage() {
  localStorage.removeItem(AUTH_CONTEXT_KEY);
}
export function saveAuthContextFromLocalStorage(auth: IAuthContext) {
  localStorage.setItem(AUTH_CONTEXT_KEY, JSON.stringify(auth));
}
