import React, {createContext, useContext, useEffect, useState} from "react";
import * as SecureStore from 'expo-secure-store';
import EndPoints from "./src/api/EndPointsMock";
import {useLinkTo} from "@react-navigation/native";
import {ActivityIndicator} from "react-native";
import {IAuthContextObject, IChat, ILoginFunctionInterface, LoginFunction} from "./Types";

export const AuthContext = createContext<{
    Auth: IAuthContextObject | null | undefined,
    savedCredentials: null | boolean | undefined,
    Login: LoginFunction
}>({
    Auth: null,
    savedCredentials: null,
    Login: async (a: ILoginFunctionInterface) => {
    },
}); // Login will be overridden
export const AuthProvider = ({children}: { children: React.ReactChildren | React.ReactNode }) => {
    const [Auth, setAuth]: [IAuthContextObject | null | undefined, any] = useState();
    const linkTo = useLinkTo();
    const [savedCredentials, setSavedCredentials] = useState<null | undefined | boolean>(null);
    const Login = async ({username, password, rememberMe}: ILoginFunctionInterface) => {
        try {
            const response = await fetch(EndPoints.Login({username, password, ip: "123", lang: "en", version: "0.1"}), {
                method: 'GET',
                headers: {},
                redirect: 'follow'
            });
            const user: IAuthContextObject | null = response.ok ? await response.json() : null;
            if (user && user.status) {
                setAuth(user);
                console.log("user recieved");
                linkTo("/Home");
                if (rememberMe) await SecureStore.setItemAsync("app.usercreds", JSON.stringify({username, password}))
            }
        } catch (e) {
            console.log(e)
            throw new Error("Invalid Server Response");
        }
    }
    const _autoLogin = async () => {
        const savedUserCreds = await SecureStore.getItemAsync('app.usercreds');
        if (savedUserCreds) {
            const {username, password} = JSON.parse(savedUserCreds);
            return await Login({username, password});
        } else setSavedCredentials(false);
    }
    useEffect(() => {
        _autoLogin().catch();
    }, []);
    return <AuthContext.Provider value={{Auth, savedCredentials, Login}}>{children}</AuthContext.Provider>
}
export const AuthContextWrapper = ({isReady, children}: { isReady: boolean, children: React.ReactChildren }) => {
    const {savedCredentials} = useContext(AuthContext);
    if (isReady) {
        const linkTo = useLinkTo();
        if (savedCredentials === false) linkTo("/Login")
        return <React.Fragment>{children}</React.Fragment>

    } else return <React.Fragment><ActivityIndicator/></React.Fragment>;
}

export const ChatContext = createContext<{ status: boolean, data: Array<IChat> } | null>(null);
export const ChatProvider = ({children}: { children: React.ReactChildren | React.ReactNode }) => {
    const [state, setState] = useState<{ status: boolean, data: Array<IChat> } | null>(null);
    const {Auth} = useContext(AuthContext);
    useEffect(() => {
        if (Auth?.token) fetch(EndPoints.GetChats({token: Auth.token}), {
            method: 'GET',
            redirect: 'follow'
        }).then(res => res.ok ? res.json() : null).then(setState);
    }, [Auth]);
    return (
        <ChatContext.Provider value={state}>{children}</ChatContext.Provider>
    )
}
type ISendMessage = ({text}: { text: string }) => Promise<void>;
type ILoad = (chat: IChat) => Promise<void>;
export const ActiveChatContext = createContext<{ Load: ILoad, SendMessage: ISendMessage, chat: {status: boolean, data: IChat} | null } | null>(null);
export const ActiveChatProvider = ({children}: { children: React.ReactChildren | React.ReactNode }) => {
    const [state, setState] = useState<{ status: boolean, data: IChat } | null>(null);
    const {Auth} = useContext(AuthContext);
    const abortController = new AbortController();
    const SendMessage = async ({text}: { text: string }) => {
        if (!state?.status || !Auth?.status) return;
        const {
            mission_id,
            owner,
            contactus_id,
            cust_chat_id,
            clientpro_cust_id,
            invoice_id,
            csv_id
        } = state.data;
        await fetch(EndPoints.SendMessage({
            token: Auth.token,
            message: text,
            lang: Auth.app_lang,
            mission_id,
            owner,
            contactus_id,
            cust_chat_id,
            clientpro_cust_id,
            invoice_id,
            csv_id,
        }), {
            method: 'GET',
            redirect: 'follow'
        }).then(res => res.ok ? res.json() : null);
        setState({
            // @ts-ignore
            ...state, data: {
                ...state.data, messages: [...state.data.messages, {
                    "type": "text",
                    "time": new Date().toString(),
                    "message": text,
                    "direction": "0",
                }]
            }
        });
    };
    const Load: ILoad = async (chat: IChat) => {
        if (Auth?.token) {
            const res = await fetch(EndPoints.GetChat({token: Auth.token, id: chat.id}), {
                method: 'GET',
                redirect: 'follow',
                signal: abortController.signal
            }).then(res => res.ok ? res.json() : null);
            console.log(res);
            setState(res);
        }
    }
    useEffect(() => {
        return () => {
            abortController.abort();
        }
    }, [])
    return (
        <ActiveChatContext.Provider value={{SendMessage, Load, chat: state}}>{children}</ActiveChatContext.Provider>
    )
}








