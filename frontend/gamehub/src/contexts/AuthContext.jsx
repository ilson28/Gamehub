import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {

    const [token, setToken] = useState(() => localStorage.getItem("token"));

    const loginContext = (token) => {

        setToken(token);
        localStorage.setItem("token", token);
    }
    const logout = () => {
        setToken(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ loginContext, logout, token, setToken }}>
            {children}
        </AuthContext.Provider>
    )

}