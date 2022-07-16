import React, {FC, useContext} from 'react';
import EndPoints from "../../api/EndPointsMock";
import {Avatar, ListItem} from "@rneui/themed";
import {ActivityIndicator, View} from "react-native";
import {AuthContext, ChatContext} from "../../../Contexts";
import {Chip, Text} from "@rneui/base";

import * as timeago from 'timeago.js';
import Colors from "../../res/colors";

interface ChatsProps {
}

const Chats: FC<ChatsProps> = ({}) => {
    const {Auth} = React.useContext(AuthContext);
    const chats = useContext(ChatContext);
    return (
        <View>
            {chats?.data.length && Auth ? chats.data.map(chat => {
                const user = Auth.team_members.find(({id}: { id: string }) => id === Object.keys(chat.users)[0])
                if (!user) return <React.Fragment/>
                return (
                    <ListItem key={Math.random()} focusable>
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
                )
            }) : <View><ActivityIndicator/></View>}
        </View>
    );
}

export default Chats;
