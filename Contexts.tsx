import React, {createContext, useContext, useEffect, useState} from "react";
import EndPoints from "./src/api/EndPoints";
import {IAuthContextObject, IChat, ILoginFunctionInterface, LoginFunction} from "./Types";
import Fuse from "fuse.js";


type IAuthLoginFunction = (a: ILoginFunctionInterface) => any;
/** Login will be overridden **/
export const AuthContext = createContext<{ Auth: IAuthContextObject | null | undefined, Login: LoginFunction }>({
    Auth: null,
    Login: null
});
export const AuthProvider = ({children}: { children: React.ReactChildren | React.ReactNode }) => {
    const [Auth, setAuth]: [IAuthContextObject | null | undefined, any] = useState();
    const Login = async ({username, password}: ILoginFunctionInterface) => {
        const response = await fetch(EndPoints.Login({username, password, ip: "123", lang: "en", version: "0.1"}), {
            method: 'GET',
            headers: {},
            redirect: 'follow'
        });
        const user: IAuthContextObject | null = response.ok ? await response.json() : null;
        if (user && user.status) return setAuth({...user, token: "GC8RUZ98QWERT"});
        else throw new Error("User Response Null");
    }
    return <AuthContext.Provider value={{Auth, Login}}>{children}</AuthContext.Provider>
};

export const ChatContext = createContext<{ status: boolean, fuse: Fuse, data: Array<IChat> } | null>(null);
export const ChatProvider = ({children}: { children: React.ReactChildren | React.ReactNode }) => {
    const [state, setState] = useState<{ status: boolean, fuse: Fuse, data: Array<IChat> } | null>(null);
    const {Auth} = useContext(AuthContext);
    useEffect(() => {
        if (Auth?.token) fetch(EndPoints.GetChats({token: Auth.token}), {
            method: 'GET',
            redirect: 'follow'
        }).then(res => res.ok ? res.json() : null).then(res => {
            const options = {
                includeScore: true,
                keys: ["messages.message"],
            }
            const fuse = new Fuse(res.data, options);
            setState({...res, fuse: fuse});
        });
    }, [Auth]);
    return <ChatContext.Provider value={state}>{children}</ChatContext.Provider>;
}
type ISendMessage = ({text}: { text: string }) => Promise<void>;
type ILoad = (chat: IChat) => Promise<void>;
export const ActiveChatContext = createContext<{ Load: ILoad, SendMessage: ISendMessage, chat: { status: boolean, data: IChat } | null } | null>(null);
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
            csv_id,
            _id,
            project_id,
            users,
        } = state.data;

        console.log(Auth.token)
        const res = await fetch(EndPoints.SendMessage({
            token: Auth.token,
            lang: Auth.app_lang,
            // version? : string,
            mission_id: mission_id,
            owner: owner,
            contactus_id: contactus_id,
            cust_chat_id: cust_chat_id,
            // ip? : string,
            _id: _id,
            project_id: project_id,
            recipient_id: Object.keys(users)[0],
            clientpro_cust_id: clientpro_cust_id,
            invoice_id: invoice_id,
            csv_id: csv_id,
            message: text
        }), {
            method: 'GET',
            redirect: 'follow'
        }).then(res => res.json());
    };
    const Load: ILoad = async (chat: IChat) => {
        if (Auth?.token) {
            const res = await fetch(EndPoints.GetChat({token: Auth.token, id: chat.id}), {
                method: 'GET',
                redirect: 'follow',
                signal: abortController.signal
            }).then(res => res.ok ? res.json() : null);
            console.log("chat", res);
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








