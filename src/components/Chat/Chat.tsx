import React, {memo, useContext, useEffect, useRef, useState} from 'react'
import {Actions, Bubble, GiftedChat} from 'react-native-gifted-chat'
import {ActiveChatContext, AuthContext} from "../../../Contexts";
import {BottomSheet, Button, Icon} from "@rneui/base"
import {
    ActivityIndicator,
    Alert,
    BackHandler,
    Image,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View
} from "react-native";
import Colors from "../../res/colors";
import {Avatar, ListItem} from "@rneui/themed";
import Mime from "mime";
import {ResolveUsers} from "./utils";
import Spinner from "../Spinner";
import {pickImageAsync, takePictureAsync} from "./mediaUtils";
import {Spring} from "../Animations/Spring";
import * as FileSystem from 'expo-file-system';
import EndPoints from "../../api/EndPoints";


export function ConversationView({navigation, route}) {
    const {Auth} = useContext(AuthContext);
    const {chat, SendMessage} = useContext(ActiveChatContext);
    const giftedChatRef = useRef();
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
    const [editDialog, setEditDialog] = useState({
        editing: false,
        opened: false,
        message: null
    });
    const ThemedBubble = memo(props => (
            <Bubble
                {...props}
                onLongPress={async () => {
                    setEditDialog({
                        ...editDialog,
                        opened: true,
                        editing: true,
                        message: props.currentMessage
                    });
                }}
                textStyle={{color: "white"}}
                wrapperStyle={{left: {backgroundColor: Colors.tertiary}}}
            />
        )
    );
    const DiscardMessageEditing = () => {
        Alert.alert("Discard this message", "", [{
            text: "Discard", onPress: async () => {
                setEditDialog({
                    editing: false,
                    opened: false,
                    message: null,
                    loading: false
                });
                setState({...state, text: "", image: null, working: false});
                BackHandler.removeEventListener("hardwareBackPress", DiscardMessageEditing);
            }
        }], {cancelable: true});
        return true
    }
    return (
        <View>
            {
                Auth && chat?.status ? <View>
                    <View style={{
                        backgroundColor: Colors.white,
                        width: "100%",
                        position: "absolute",
                        height: 60,
                        zIndex: 999,
                        top: 0,
                        paddingTop: 12.5,
                        elevation: 5,
                        ...styles.rowFlex,
                    }}>
                        <View style={{...styles.rowFlex, width: "50%",}}>
                            <Button onPress={() => navigation.goBack()} icon={{name: "arrow-back"}} containerStyle={{
                                width: 50, height: 50,
                                marginRight: 20, backgroundColor: "transparent"
                            }} color={"transparent"}/>
                            {state.users.filter((user: {
                                "id": string,
                                "user_name": string,
                                "name": string,
                                "profile_image": string
                            }) => user.id !== Auth.id).map((user, index) => (
                                <Avatar key={index} rounded
                                        containerStyle={{marginLeft: -10, borderWidth: 1, borderColor: "black"}}
                                        source={{uri: user.profile_image}}/>
                            ))}
                            <View style={{...styles.rowFlex, marginLeft: 20}}>
                                {state.users.filter((user: {
                                    "id": string,
                                    "user_name": string,
                                    "name": string,
                                    "profile_image": string
                                }) => user.id !== Auth.id).map((user, index) => (
                                    <Text key={index} style={{fontSize: 20, fontWeight: "bold", textAlign: "center"}}>
                                        {user?.name}{(index < state.users.length - 2) && state.users.length > 2 ? "," : ""}
                                    </Text>
                                ))}
                            </View>
                        </View>
                        <View style={styles.rowFlex}>
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
                        ref={giftedChatRef}
                        renderBubble={props => <ThemedBubble {...props}/>}
                        renderActions={props => <Actions
                            {...props}
                            options={{
                                'Choose From Library': async () => {
                                    setState({...state, image: await pickImageAsync()})
                                },
                                'Take Picture': async () => {
                                    setState({...state, image: await takePictureAsync()})
                                },
                                'Cancel': async () => {
                                },
                            }}
                            icon={() => (
                                <Icon disabled={!!state.image} name={'add'} size={28} color={Colors.tertiary}/>)}
                        />}
                        messages={state.formattedMessages}
                        text={state.text}
                        alwaysShowSend
                        onInputTextChanged={text => setState({...state, text})}
                        onSend={async (messages) => {
                            setState({...state, working: true});
                            messages[messages.length - (1)] = {
                                ...messages[messages.length - (1)],
                                image: state.image?.uri
                            };
                            if (editDialog.editing) {
                                const a = state.formattedMessages[state.formattedMessages.findIndex(message => message.id === messages[messages.length - (1)].id)] = messages[messages.length - (1)];
                                setState(a);
                                giftedChatRef.current.scrollToBottom();
                                return;
                            } else {
                                setState({
                                    ...state,
                                    formattedMessages: GiftedChat.append(state.formattedMessages, messages),
                                    image: null,
                                    text: "",
                                    working: false
                                });
                                giftedChatRef.current.scrollToBottom();
                                await SendMessage(state.text, state.image);
                            }
                        }}
                        user={{_id: Auth.id, name: Auth.user_name}}
                    />
                    <BottomSheet isVisible={editDialog.opened}
                                 onBackdropPress={() => setEditDialog({...editDialog, opened: false, message: null})}>
                        <View style={{
                            backgroundColor: "white",
                            borderTopRightRadius: 15,
                            borderTopLeftRadius: 15,
                            paddingVertical: 20
                        }}>
                            <ListItem onPress={async () => {
                                setEditDialog({...editDialog, loading: true});
                                const d = editDialog.message.image ? (editDialog.message.image.slice(0, 4) === "file" ? await FileSystem.getInfoAsync(editDialog.message.image) : await FileSystem.downloadAsync(editDialog.message.image, FileSystem.documentDirectory + editDialog.message.image.split("/").pop())) : null;
                                setState({...state, image: d, text: editDialog.message.text});
                                setEditDialog({...editDialog, opened: false, loading: false, editing: true});
                                BackHandler.addEventListener("hardwareBackPress", DiscardMessageEditing);
                            }}>
                                <ListItem.Content>
                                    <ListItem.Title>{editDialog.loading ?
                                        <ActivityIndicator/> : "Edit Message"}</ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                            <ListItem onPress={async () => {
                                // TODO Delete Message Logic: DONE
                                await fetch(EndPoints.DeleteMessage({
                                    token: Auth.token,
                                    time: chat.data.messages[state.formattedMessages.findIndex(m => m.id === editDialog.message.id)].time,
                                    _id: chat.data._id
                                }))
                                setState({
                                    ...state,
                                    formattedMessages: state.formattedMessages.filter(m => m.id !== editDialog.message.id)
                                });
                            }}>
                                <ListItem.Content>
                                    <ListItem.Title>Delete Message</ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                        </View>
                    </BottomSheet>
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

const styles = StyleSheet.create({
    rowFlex: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row"
    }
})

export default memo(ConversationView);