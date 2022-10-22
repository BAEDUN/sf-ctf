import React, { createContext, useState, Dispatch, SetStateAction, PropsWithChildren } from "react";

export interface IAuthContext {
    token: string;
    // nickname: string;
    // username: string;
}

export const AuthContext = createContext<{
    auth: IAuthContext | null,
    setAuth: Dispatch<SetStateAction<IAuthContext | null>>
}>({
    auth: null,
    setAuth: () => null
});

export function AuthProvider(props: PropsWithChildren<{}>) {
    const [auth, setAuth] = useState<IAuthContext | null>(null);
    return <AuthContext.Provider value={{ auth, setAuth }} {...props} />
}

