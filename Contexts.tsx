import React from "react";
import * as SecureStore from 'expo-secure-store';
import EndPoints from "./src/api/EndPoints";
import {useLinkTo} from "@react-navigation/native";

export const AuthContext = React.createContext({Login: async ({username, password, rememberMe}) => {}, Auth: undefined}); // Login will be overridden
export const AuthProvider = ({children}) => {
    const [Auth, setAuth] = React.useState();
    const linkTo = useLinkTo();
    const Login = async ({username, password, rememberMe}: {username: string, password: string, rememberMe: boolean}) => {
        try {
            const response = await fetch(EndPoints.Login({username, password, ip: "123", lang: "en", version: "0.1"}), {
                method: 'GET',
                headers: {},
                redirect: 'follow'
            });
            const user = await response.json();
            if (user || user.status) {
                setAuth(user);
                console.log(user);
                linkTo("Home");
            }
        } catch (e) {
            throw new Error("Invalid Server Response");
        }
    }
    return <AuthContext.Provider value={{Auth, Login}}>{children}</AuthContext.Provider>
}
// @ts-ignore
export const _AuthProvider = ({children}) => {
    const [user, setUser] = React.useState(null);
    // @ts-ignore
    const Login = async ({username, password}) => {
        const res = await fetch("https://localhost:3000/authentication/login", {
            method: "post",
            body: JSON.stringify({
                username: username,
                password: password
            })
        }).then(res => res.ok ? res.json() : null);
        if (!res) throw new Error("Wrong Username or Password");
        else return res;
    }
    // const linkTo = useLinkTo();
    const autoLogin = async () => {
        const savedUserCreds = await SecureStore.getItemAsync('app.usercreds');
        if (savedUserCreds) {
            const {username, password} = JSON.parse(savedUserCreds);
            return await Login({username, password});
        }
        // else linkTo("Login");
    }
    React.useEffect(() => {
        autoLogin();
    }, []);
    //@ts-ignore
    return <AuthContext.Provider value={{user, Login: Login, loggedIn: !!user}}>{children}</AuthContext.Provider>
}