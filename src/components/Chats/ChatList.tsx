import React, {memo} from 'react';
import {Avatar, ListItem} from "@rneui/themed";
import {GestureResponderEvent, ScrollView, TouchableHighlight, View} from "react-native";
import {AuthContext} from "../../../Contexts";
import {Chip, Text} from "@rneui/base";

import * as timeago from 'timeago.js';
import Colors from "../../res/colors";
import {IChat} from "../../../Types";
import Spinner from "../Spinner";

type IOnItemPress = (chat: IChat, e: GestureResponderEvent) => void | Promise<any>;
const ChatList = ({chats, onItemPress}: { onItemPress: IOnItemPress, chats: Array<IChat> | null | undefined }) => {
    const {Auth} = React.useContext(AuthContext);
    return (
        <ScrollView style={{marginBottom: "10%"}} contentContainerStyle={{flexGrow: 1}}>
            {chats?.length && Auth ? chats.map(chat => {
                const users = Object.keys(chat.users).filter(a => a).map(_id => Auth.team_members.find(({id}: { id: string }) => id === _id)).filter(a => a);
                if (!users.length) return null
                return (
                    <TouchableHighlight underlayColor={"#FAFAFA"} onPress={(e) => {
                        onItemPress(chat, e);
                    }} key={Math.random()}>
                        <ListItem focusable>
                            <Avatar rounded source={{uri: users[0].profile_image}}/>
                            <ListItem.Content>
                                <ListItem.Title>{users[0].name}</ListItem.Title>
                                <ListItem.Subtitle>{chat.messages[0].type}</ListItem.Subtitle>
                            </ListItem.Content>
                            <View style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                width: "35%"
                            }}>
                                <Text style={{
                                    marginTop: "5%",
                                    color: Colors.grey.primary
                                }}>{timeago.format(chat.last_update, 'en_US')}</Text>
                                <Chip containerStyle={{
                                    height: 35, width: 35,
                                    margin: 0
                                }} color={Colors.tertiary}>
                                    <Text>{chat.messages.length}</Text>
                                </Chip>
                            </View>
                        </ListItem>
                    </TouchableHighlight>
                )
            }) : <Spinner/>}
        </ScrollView>
    );
}

export default memo(ChatList);
