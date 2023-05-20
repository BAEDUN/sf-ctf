import { atom } from "recoil";

const AUTH_CONTEXT_KEY = "authContext";

export namespace AuthState {
  export const auth = atom<AuthContext | null>({
    key: "AuthState.auth",
    default: tryGetAuthContextFromLocalStorage(),
    effects: [
      ({ onSet }) => {
        onSet((newValue) => {
          setAuthContextToLocalStorage(newValue);
        });
      },
    ],
  });
}

export type AuthContext = {
  token: string;
};

function tryGetAuthContextFromLocalStorage(): AuthContext | null {
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
    } as AuthContext;
  } catch {
    return null;
  }
}
function setAuthContextToLocalStorage(authContext: AuthContext | null) {
  if (authContext) {
    localStorage.setItem(AUTH_CONTEXT_KEY, JSON.stringify(authContext));
    return;
  }
  localStorage.removeItem(AUTH_CONTEXT_KEY);
}
