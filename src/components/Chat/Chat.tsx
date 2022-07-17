import React, {useContext, useEffect, useState} from 'react'
import {Bubble, GiftedChat} from 'react-native-gifted-chat'
import {ActiveChatContext, AuthContext} from "../../../Contexts";
import {Button, Input, Text} from "@rneui/base"
import {View} from "react-native";
import Colors from "../../res/colors";
import {Avatar} from "@rneui/themed";

// const socket = io("ws://192.168.10.2:3001");
// console.log(socket);
// socket.on("connect", console.log)
const ThemedInput = () => {
    return <Input/>
}

export function ConversationView({navigation}) {
    const {Auth} = useContext(AuthContext);
    const {chat} = useContext(ActiveChatContext);
    const [text, setText] = useState("");
    const [user, setUser] = useState<{ id: string; user_name: string; name: string; profile_image: string; } | undefined>(undefined);
    useEffect(() => {
        Auth && chat?.status ? setUser(Auth.team_members.find(user => user.id === Object.keys(chat.data.users)[0])) : null;
    }, [chat]); // Reloads with active chat
    console.log(!!Auth, !!chat, !!user);
    return (
        <View>
            {Auth && chat?.status && user ? <View style={{
                height: "100%",
                // flex: 1
            }}>
                <View style={{
                    display: "flex",
                    backgroundColor: Colors.white,
                    width: "100%",
                    position: "absolute",
                    height: 60,
                    zIndex: 999,
                    top: 0,
                    paddingTop: 10,
                    justifyContent: "space-between",
                    flexDirection: "row"
                }}>
                    <View style={{
                        display: "flex",
                        width: "50%",
                        justifyContent: "space-between",
                        flexDirection: "row"
                    }}>
                        <Button onPress={() => {
                            navigation.goBack()
                        }} icon={{
                            name: "arrow-back"
                        }} containerStyle={{
                            width: 50, height: 50,
                            backgroundColor: "transparent"
                        }} color={"transparent"}/>
                        <Avatar rounded source={{uri: user.profile_image}}/>
                        <Text style={{
                            fontSize: 20,
                            fontWeight: "bold",
                            textAlign: "center",
                        }}>{user?.name}</Text>
                    </View>
                    <View style={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexDirection: "row"
                    }}>
                        <Button icon={{
                            name: "videocam"
                        }} containerStyle={{
                            width: 50, height: 50,
                            backgroundColor: "transparent"
                        }} color={"transparent"}/>
                        <Button onPress={() => {
                            navigation.navigate("VideoSDK", {
                                api_key: "0b360177-d459-4975-b383-aaa65c4a1698",
                                meeting_id: chat?.data.id,
                                name: Auth?.user_name
                            });
                        }} icon={{
                            name: "call"
                        }} containerStyle={{
                            width: 50, height: 50,
                            backgroundColor: "transparent"
                        }} color={"transparent"}/>
                    </View>
                </View>
                <GiftedChat
                    messagesContainerStyle={{
                        marginTop: 25
                    }}
                    renderUsernameOnMessage={true}
                    renderBubble={props => {
                        return (
                            <Bubble
                                {...props}
                                textStyle={{
                                    color: "white"
                                }}
                                wrapperStyle={{
                                    left: {
                                        backgroundColor: Colors.tertiary,
                                    },
                                }}
                            />
                        );
                    }}
                    messages={chat.data.messages.map(message => {
                        return ({
                            _id: Math.random(),
                            text: message.message,
                            createdAt: new Date(message.time),
                            user: {
                                _id: user.id,
                                name: user.name,
                                avatar: user.profile_image,
                            },
                        })
                    })}
                    text={text}
                    alwaysShowSend
                    onInputTextChanged={_text => setText(_text)}
                    onSend={messages => {
                    }}
                    user={{
                        _id: Auth?.id,
                        name: Auth?.user_name,
                    }}
                />
            </View> : <Text>"null"</Text>}
        </View>

    )
}

export default ConversationView