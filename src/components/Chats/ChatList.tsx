import React, {memo} from 'react';
import {Avatar, ListItem} from "@rneui/themed";
import {ActivityIndicator, GestureResponderEvent, ScrollView, TouchableHighlight, View} from "react-native";
import {AuthContext} from "../../../Contexts";
import {Chip, Text} from "@rneui/base";

import * as timeago from 'timeago.js';
import Colors from "../../res/colors";
import {IChat} from "../../../Types";

type IOnItemPress = (chat: IChat, e: GestureResponderEvent) => void | Promise<any>;
const ChatList = ({chats, onItemPress}: { onItemPress: IOnItemPress, chats: Array<IChat> | null | undefined }) => {
    const {Auth} = React.useContext(AuthContext);
    return (
        <ScrollView style={{marginBottom: "10%"}}>
            {chats?.length && Auth ? chats.map(chat => {
                const user = Auth.team_members.find(({id}: { id: string }) => id === Object.keys(chat.users)[0])
                if (!user) return <React.Fragment/>
                return (
                    <TouchableHighlight underlayColor={"#FAFAFA"} onPress={(e) => {
                        onItemPress(chat, e);
                    }} key={Math.random()}>
                        <ListItem focusable>
                            <Avatar rounded source={{uri: user.profile_image}}/>
                            <ListItem.Content>
                                <ListItem.Title>{user.name}</ListItem.Title>
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
            }) : <View><ActivityIndicator/></View>}
        </ScrollView>
    );
}

export default memo(ChatList);
