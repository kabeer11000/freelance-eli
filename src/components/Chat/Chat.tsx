import React, {useContext, useEffect, useState} from 'react'
import {Actions, Bubble, GiftedChat} from 'react-native-gifted-chat'
import {ActiveChatContext, AuthContext} from "../../../Contexts";
import {Button, Icon} from "@rneui/base"
import {ActivityIndicator, Alert, Text, View} from "react-native";
import Colors from "../../res/colors";
import * as ImagePicker from 'expo-image-picker';
import {Avatar} from "@rneui/themed";

export function ConversationView({navigation, route}) {
    const {Auth} = useContext(AuthContext);
    const {chat, SendMessage} = useContext(ActiveChatContext);
    const {multi} = route;
    const [text, setText] = useState("");
    const [users, setUsers] = useState([]);
    const [giftedMessages, setGiftedMessages] = useState([]);
    useEffect(() => {
        if (Auth?.status && chat?.status) {
            setUsers(Object.keys(chat.data.users).map(_id => {
                return Auth.team_members.find(({id}: { id: string }) => id === _id) ?? _id === Auth.id ? ({
                    id: Auth.id,
                    profile_image: Auth.profile_image,
                    name: Auth.user_name
                }) : null
                // return ({
                //     _id: Auth.id,
                //     profile_image: Auth.profile_image,
                //     name: Auth.user_name
                // })
            }).filter(a => a));
            // const user_ids = Object.keys(chat.data.users);
            // let user;
            // for (const id of user_ids) {
            //     const _user = Auth.team_members.find(({id}: { id: string }) => id === id);
            //     if (_user) {
            //         user = _user;
            //         break;
            //     }
            // }
            // setUser(user);
        }
        if (chat?.status) setGiftedMessages(chat.data.messages.map(message => {
            /** remove chat message user id  **/
                // const user = users.find(({id}) => id === message.user_id)
            const user = users.find(({id}) => id === Object.keys(chat.data.users)[0]) || {
                    id: "unknown",
                    name: "Unknown",
                    profile_image: "https://icon-library.com/images/unknown-person-icon/unknown-person-icon-4.jpg"
                };
            return ({
                _id: Math.random(),
                text: message.message,
                createdAt: new Date(message.time),
                user: {
                    _id: Auth.id,
                    name: Auth.user_name,
                    avatar: user.profile_image,
                },
            })
        }).reverse());
    }, [chat]); // Reloads with active chat
    const [image, setImage] = useState<any>();
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            base64: true,
            quality: 1,
        });
        if (!result.cancelled) setImage(result);
    };
    // @ts-ignore
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
                        <Button onPress={() => navigation.goBack()} icon={{name: "arrow-back"}} containerStyle={{
                            width: 50, height: 50,
                            backgroundColor: "transparent"
                        }} color={"transparent"}/>
                        {/*{console.log(users)}*/}
                        {users?.map((user, index) => <Avatar key={index} rounded source={{uri: user.profile_image}}/>)}
                        {users?.map((user, index) => (
                            // @ts-ignore
                            <Text key={index} style={{
                                fontSize: 20,
                                fontWeight: "bold",
                                textAlign: "center",
                            }}>{user?.name}</Text>
                        ))}
                        {/*<Avatar rounded source={{uri: users[0].profile_image}}/>*/}
                        {/*<Text style={{*/}
                        {/*    fontSize: 20,*/}
                        {/*    fontWeight: "bold",*/}
                        {/*    textAlign: "center",*/}
                        {/*}}>{users[0]?.name}</Text>*/}
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
                        <Button onPress={() => {
                            navigation.navigate("VideoSDKWebView", {
                                api_key: "0b360177-d459-4975-b383-aaa65c4a1698",
                                meeting_id: chat?.data.id,
                                name: Auth?.user_name
                            });
                        }} icon={{name: "call"}} containerStyle={{
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
                                    await Alert.alert("Select " + image.name, "This image will be sent when you send the message");
                                    await SendMessage({file: image, text: ""});
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
                        // console.log([...messages].at(-1));
                        await SendMessage({text: messages[messages.length - (1)].text});
                        // console.log(giftedMessages.length, messages, [...giftedMessages, messages.at(-1)].length)
                        setGiftedMessages(GiftedChat.append(giftedMessages, messages));
                    }}
                    user={{_id: Auth.id, name: Auth.user_name}}
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