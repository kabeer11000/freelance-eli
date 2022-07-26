import React, {createContext, useContext, useEffect, useState} from "react";
import EndPoints from "./src/api/EndPoints";
import {IAuthContextObject, IChat, ILoginFunctionInterface, LoginFunction} from "./Types";
import Fuse from "fuse.js";
import {toFormData} from "./src/Utils";
import Mime from "mime";

type IAuthLoginFunction = (a: ILoginFunctionInterface) => any;
/** Login will be overridden **/
export const AuthContext = createContext<{ Auth: IAuthContextObject | null | undefined, Login: LoginFunction }>({
    Auth: null,
    Login: null
});
export const AuthProvider = ({children}: { children: React.ReactChildren | React.ReactNode }) => {
    const [Auth, setAuth]: [IAuthContextObject | null | undefined, any] = useState();
    const abortController = new AbortController()
    const Login = async ({username, password}: ILoginFunctionInterface) => {
        const response = await fetch(EndPoints.Login({username, password, ip: "123", lang: "en", version: "0.1"}), {
            method: 'GET',
            signal: abortController.signal,
        });
        const user: IAuthContextObject | null = response.ok ? await response.json() : null;
        // console.log(user);
        if (user && user.status) return setAuth({
            ...user,
            token: "YIRQGWLH169WHKP23642"
        }); /** , token: "YIRQGWLH169WHKP23642"  heard Coded token was used to send chat messages **/
        else throw new Error("User Response Null");
    }
    useEffect(() => {
        return () => abortController.abort();
    }, []);
    return <AuthContext.Provider value={{Auth, Login}}>{children}</AuthContext.Provider>
};

export const ChatContext = createContext<{ status: boolean, error?: boolean, fuse: Fuse, data: Array<IChat> | null | undefined } | null>(null);
export const ChatProvider = ({children}: { children: React.ReactChildren | React.ReactNode }) => {
    const [state, setState] = useState<{ status: boolean, error?: boolean, fuse: Fuse, data: Array<IChat> | null | undefined } | null>(null);
    const {Auth} = useContext(AuthContext);
    const abortController = new AbortController();
    useEffect(() => {
        // if (Auth?.token) console.log(EndPoints.GetChats({token: Auth.token, page: "1"}))
        if (Auth?.token) fetch(EndPoints.GetChats({token: Auth.token, page: "1"}), {
            method: 'GET',
            signal: abortController.signal,
            redirect: 'follow'
        }).then(res => res.ok ? res.json() : null).then(res => {
            if (!res.status) return setState({
                status: false,
                fuse: null,
                data: null,
                error: true
            });
            const fuse = new Fuse(res.data, {
                includeScore: true,
                keys: ["messages.message"],
            });
            setState({...res, fuse: fuse});
        });
        return () => abortController.abort();
    }, [Auth]);
    return <ChatContext.Provider value={state}>{children}</ChatContext.Provider>;
}
type ISendMessage = (text, image: any) => Promise<void>;
type ILoad = (chat: IChat) => Promise<void>;
export const ActiveChatContext = createContext<{ Load: ILoad, SendMessage: ISendMessage, chat: { status: boolean, data: IChat } | null } | null>(null);
export const ActiveChatProvider = ({children}: { children: React.ReactChildren | React.ReactNode }) => {
    const [state, setState] = useState<{ status: boolean, data: IChat } | null>(null);
    const {Auth} = useContext(AuthContext);
    const abortController = new AbortController();

    const SendMessage = async (text: string, file: any) => {
        if (!state?.status || !Auth?.status) return;
        const {
            _id,
        } = state.data;
        const formData = toFormData({
            token: Auth.token,
            lang: Auth.app_lang,
            ip: "123",
            version: "0.1",
            owner: Auth.id, //Object.keys(state.data.users)[0],
            message: text || "",
            recipient_id: Object.keys(state.data.users).filter(id => id !== Auth.id)[0],
            _id,
        });
        if (file) formData.append("uploadedFile", {
            uri: file.uri,
            name: file.uri.split("/").pop(),
            type: Mime.getType(file.uri),
        });
        const response = await fetch("https://bull36.com/app/add_chat", {
            method: 'POST',
            headers: {
                "Content-Type": "multipart/form-data"
            },
            body: formData,
            redirect: 'follow'
        });
        const res: IChat = response.ok ? await response.json() : null;
        /** Send Add Message Request attach formdata to body TODO **/
    };
    const Load: ILoad = async (chat: IChat) => {
        if (Auth?.token) {
            const res = await fetch(EndPoints.GetChat({token: Auth.token, id: chat._id["$oid"]}), {
                method: 'GET',
                redirect: 'follow',
                signal: abortController.signal
            }).then(res => res.ok ? res.json() : null);
            setState(res);
        }
    }
    useEffect(() => {
        return () => abortController.abort();
    }, []);
    return (
        <ActiveChatContext.Provider value={{SendMessage, Load, chat: state}}>{children}</ActiveChatContext.Provider>
    )
}








