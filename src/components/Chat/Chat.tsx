import React, {useContext, useEffect, useState} from 'react'
import {Actions, Bubble, GiftedChat} from 'react-native-gifted-chat'
import {ActiveChatContext, AuthContext} from "../../../Contexts";
import {Button, Icon} from "@rneui/base"
import {ActivityIndicator, Image, Text, TouchableWithoutFeedback, View} from "react-native";
import Colors from "../../res/colors";
import {Avatar} from "@rneui/themed";
import Mime from "mime";
import {ResolveUsers} from "./utils";
import Spinner from "../Spinner";
import {pickImageAsync, takePictureAsync} from "./mediaUtils";
import {Spring} from "../Animations/Spring";

export function ConversationView({navigation, route}) {
    const {Auth} = useContext(AuthContext);
    const {chat, SendMessage} = useContext(ActiveChatContext);
    const [state, setState] = useState({
        text: "",
        users: [],
        formattedMessages: [],
        image: null,
        working: false
    });
    useEffect(() => {
        if (!Auth?.status || !chat?.status) return;
        const users = ResolveUsers(Auth, Object.keys(chat.data.users)) || [];
        const messages = chat.data.messages.map(message => {
            /** remove chat message user id  **/
            const user = users.find(({id}) => id === Object.keys(chat.data.users)[0]) || {
                id: "unknown",
                name: "Unknown",
                profile_image: "https://icon-library.com/images/unknown-person-icon/unknown-person-icon-4.jpg"
            };
            const fileType = Mime.getType(message.file_url);
            return ({
                _id: Math.random(),
                text: message.message,
                createdAt: new Date(message.time.slice(-2)),
                image: fileType?.split("/")[0] === "image" ? message.file_url : undefined,
                video: fileType?.split("/")[0] === "video" ? message.file_url : undefined,
                user: {
                    _id: Auth.id,
                    name: Auth.user_name,
                    avatar: user.profile_image,
                },
            })
        }).reverse();
        setState({...state, users, formattedMessages: messages});
    }, [chat]);
    return (
        <View>
            {Auth && chat?.status ? <View style={{height: "100%"}}>
                <View style={{
                    display: "flex",
                    backgroundColor: Colors.white,
                    width: "100%",
                    position: "absolute",
                    height: 60,
                    zIndex: 999,
                    top: 0,
                    paddingTop: 12.5,
                    justifyContent: "space-between",
                    flexDirection: "row"
                }}>
                    <View style={{
                        display: "flex",
                        width: "50%",
                        justifyContent: "space-between",
                        flexDirection: "row"
                    }}>
                        <Button onPress={() => navigation.goBack()} icon={{name: "arrow-back"}} containerStyle={{
                            width: 50, height: 50,
                            marginRight: 20,
                            backgroundColor: "transparent"
                        }} color={"transparent"}/>
                        {state.users.filter((user: {
                            "id": string,
                            "user_name": string,
                            "name": string,
                            "profile_image": string
                        }) => user.id !== Auth.id).map((user, index) => <Avatar key={index} rounded containerStyle={{
                            marginLeft: -10,
                            borderWidth: 1,
                            borderColor: "black"
                        }} source={{uri: user.profile_image}}/>)}
                        <View style={{
                            display: "flex",
                            marginLeft: 20,
                            justifyContent: "space-between",
                            flexDirection: "row"
                        }}>
                            {state.users.filter((user: {
                                "id": string,
                                "user_name": string,
                                "name": string,
                                "profile_image": string
                            }) => user.id !== Auth.id).map((user, index) => (
                                <Text key={index} style={{
                                    fontSize: 20,
                                    fontWeight: "bold",
                                    textAlign: "center",
                                }}>{user?.name}{(index < state.users.length - 2) && state.users.length > 2 ? "," : ""}</Text>
                            ))}
                        </View>
                    </View>
                    <View style={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexDirection: "row"
                    }}>
                        <Button onPress={() => navigation.navigate("VideoSDKWebView", {
                            api_key: "0b360177-d459-4975-b383-aaa65c4a1698",
                            meeting_id: chat?.data.id,
                            name: Auth?.user_name
                        })} icon={{name: "videocam"}} containerStyle={{
                            width: 50, height: 50,
                            backgroundColor: "transparent"
                        }} color={"transparent"}/>
                        <Button onPress={() => navigation.navigate("VideoSDKWebView", {
                            api_key: "0b360177-d459-4975-b383-aaa65c4a1698",
                            meeting_id: chat?.data.id,
                            name: Auth?.user_name
                        })} icon={{name: "call"}} containerStyle={{
                            width: 50, height: 50,
                            backgroundColor: "transparent"
                        }} color={"transparent"}/>
                    </View>
                </View>
                <GiftedChat
                    messagesContainerStyle={{marginTop: 25, paddingBottom: 25}}
                    renderUsernameOnMessage={true}
                    disableComposer={state.working}
                    renderBubble={props => (
                        <Bubble
                            {...props}
                            textStyle={{color: "white"}}
                            wrapperStyle={{left: {backgroundColor: Colors.tertiary}}}
                        />
                    )}
                    renderActions={props => <Actions
                        {...props}
                        options={{
                            'Choose From Library': async () => {
                                setState({...state, image: await pickImageAsync(), text: " "})
                            },
                            'Take Picture': async () => {
                                setState({...state, image: await takePictureAsync(), text: " "})
                            },
                            'Cancel': async () => {
                            },
                        }}
                        icon={() => (<Icon disabled={!!state.image} name={'add'} size={28} color={Colors.tertiary}/>)}
                    />}
                    messages={state.formattedMessages}
                    text={state.text}
                    alwaysShowSend
                    onInputTextChanged={text => setState({...state, text})}
                    onSend={async (messages) => {
                        setState({...state, working: true});
                        messages[messages.length - (1)] = {...messages[messages.length - (1)], image: state.image?.uri};
                        await SendMessage(state.text, state.image);
                        setState({
                            ...state,
                            formattedMessages: GiftedChat.append(state.formattedMessages, messages),
                            image: null,
                            text: "",
                            working: false
                        });
                    }}
                    user={{_id: Auth.id, name: Auth.user_name}}
                />
                {state.image ?
                    <Spring>
                        <TouchableWithoutFeedback onPress={() => setState({...state, image: null})}>
                            <View style={{
                                position: "absolute",
                                left: 10,
                                bottom: 55,
                                zIndex: 999,
                            }}>
                                <Image style={{width: 100, height: 100}} source={{uri: state.image.uri}}/>
                                <View style={{
                                    width: 100,
                                    height: 100,
                                    position: "absolute",
                                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}>
                                    {state.working ? <ActivityIndicator/> :
                                        <Icon size={40} color={"white"} name={"close"}/>}
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Spring>
                    : null}
            </View> : <Spinner relative={true}/>
            }
        </View>

    )
}

export default ConversationView;