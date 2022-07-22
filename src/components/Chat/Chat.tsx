import React, {useContext, useEffect, useState} from 'react'
import {Actions, Bubble, GiftedChat} from 'react-native-gifted-chat'
import {ActiveChatContext, AuthContext} from "../../../Contexts";
import {Button, Icon, Input, Text} from "@rneui/base"
import {ActivityIndicator, View} from "react-native";
import Colors from "../../res/colors";
import {Avatar} from "@rneui/themed";
import * as ImagePicker from 'expo-image-picker';

// const socket = io("ws://192.168.10.2:3001");
// console.log(socket);
// socket.on("connect", console.log)
const ThemedInput = () => {
    return <Input/>
}

export function ConversationView({navigation, route}) {
    const {Auth} = useContext(AuthContext);
    const {chat, SendMessage} = useContext(ActiveChatContext);
    const {multi} = route;
    const [text, setText] = useState("");
    const [user, setUser] = useState<{ id: string; user_name: string; name: string; profile_image: string; } | undefined>(undefined);
    const [giftedMessages, setGiftedMessages] = useState([]);
    useEffect(() => {
        if (Auth && chat?.status) setUser(Auth.team_members.find(user => user.id === Object.keys(chat.data.users)[0]));
        if (chat?.status && user) setGiftedMessages(chat.data.messages.map(message => ({
            _id: Math.random(),
            text: message.message,
            createdAt: new Date(message.time),
            user: {
                _id: user.id,
                name: user.name,
                avatar: user.profile_image,
            },
        })));
    }, [chat]); // Reloads with active chat
    const [image, setImage] = useState<any>();
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            // aspect: [4, 3],
            base64: true,
            quality: 1,
        });

        if (!result.cancelled) {
            // console.log(result)
            setImage(result);
        }
    };
    return (
        <View>
            {Auth && chat?.status && user ? <View style={{height: "100%"}}>
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
                        <Button onPress={() => {
                            navigation.navigate("VideoSDKWebView", {
                                api_key: "0b360177-d459-4975-b383-aaa65c4a1698",
                                meeting_id: chat?.data.id,
                                name: Auth?.user_name
                            });
                        }} icon={{name: "videocam"}} containerStyle={{
                            width: 50, height: 50,
                            backgroundColor: "transparent"
                        }} color={"transparent"}/>
                        <Button onPress={() => {
                            navigation.navigate("VideoSDKWebView", {
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
                    messagesContainerStyle={{marginTop: 25, paddingBottom: 25}}
                    renderUsernameOnMessage={true}
                    renderBubble={props => (
                        <Bubble
                            {...props}
                            textStyle={{color: "white"}}
                            wrapperStyle={{left: {backgroundColor: Colors.tertiary}}}
                        />
                    )}
                    renderActions={(props) => (
                        <Actions
                            {...props}
                            options={{
                                ['Send Image']: async () => {
                                    await pickImage();
                                    console.log(Object.keys(image));
                                    // console.log(await (await fetch(EndPointsMock.UploadImageTest, {
                                    //     method: "post",
                                    //     body: JSON.stringify({
                                    //         image: image,
                                    //         name: image.uri.split("/").at(-1)
                                    //     })
                                    // })).json());
                                },
                            }}
                            icon={() => (<Icon name={'attachment'} size={28} color={Colors.tertiary}/>)}
                            onSend={args => {
                            }}
                        />
                    )}
                    messages={giftedMessages}
                    text={text}
                    alwaysShowSend
                    onInputTextChanged={_text => setText(_text)}
                    onSend={async (messages) => {
                        await SendMessage({text: messages.at(-1).text});
                        // console.log(giftedMessages.length, messages, [...giftedMessages, messages.at(-1)].length)
                        setGiftedMessages(GiftedChat.append(giftedMessages, messages));
                    }}
                    user={{_id: Auth?.id, name: Auth?.user_name}}
                />
            </View> : <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                top: 0,
                left: 0,
                backgroundColor: '#fff',
                height: '100%',
                width: '100%'
            }}>
                <ActivityIndicator size="large" color="#f29900"/>
            </View>
            }
        </View>

    )
}

export default ConversationView