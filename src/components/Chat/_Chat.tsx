import React, {useCallback, useContext, useEffect, useState} from 'react'
import {GiftedChat} from 'react-native-gifted-chat'
import {io} from "socket.io-client";
import {AuthContext} from "../../../Contexts";
import {v4} from "uuid";
import {Input} from "@rneui/base"
import {SafeAreaView} from "react-native-safe-area-context";
import {View} from "react-native";

// const socket = io("ws://192.168.10.2:3001");
// console.log(socket);
// socket.on("connect", console.log)
const ThemedInput = () => {
    return <Input/>
}

export function Example({remoteUserId}) {
    if (!remoteUserId) remoteUserId = "f02a76c5-9c98-4268-83e0-3069fbe9b0a7"
    console.log(remoteUserId)
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("text");
    const LoadInitialChat = async ({remoteUserId, userId}) => {
        console.log(`http://localhost:3000/chats/get/${userId}/${remoteUserId}`)
        const _chats = await (await fetch(`http://192.168.10.2:3000/chats/get/${userId}/${remoteUserId}`)).json();
        console.log(_chats)
        setMessages(_chats)
    }
    const {user} = useContext(AuthContext);
    useEffect(() => {
        LoadInitialChat({userId: user.id, remoteUserId});
        // socket.on("message", ({message, remoteUser, user}) => {
        //     if (remoteUser === user.id) {
        //     @ts-ignore
            // setMessages([...messages, message]);
            // }
        // })
    }, [])
    const onSend = useCallback((messages = []) => {
        // setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
        // socketio server will emit message to  everyone including me :)
        console.log(user, remoteUserId)
        // console.log("messages: ", messages)
        // socket.emit("send-message", {message: {...messages.at(-1), user: {
        //             _id: user.id,
        //             name: user.name
        //         }}, user: user.id, remoteUser: remoteUserId});
    }, [])

    return (
        <SafeAreaView>
            <View style={{
                height: "100%"
            }}>
                <GiftedChat
                    messages={messages}
                    text={text}
                    alwaysShowSend
                    onInputTextChanged={_text => setText(_text)}
                    onSend={messages => onSend(messages)}
                    user={{
                        _id: user.id,
                        name: user.name
                    }}
                />
            </View>
        </SafeAreaView>

    )
}

export default Example