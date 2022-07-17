import React, {FC, useContext} from 'react';
import EndPoints from "../../api/EndPointsMock";
import {Avatar, ListItem} from "@rneui/themed";
import {ActivityIndicator, View} from "react-native";
import {ActiveChatContext, AuthContext, ChatContext} from "../../../Contexts";
import {Chip, Text} from "@rneui/base";

import * as timeago from 'timeago.js';
import Colors from "../../res/colors";
import ChatList from "./ChatList";
import {useNavigation} from "@react-navigation/native";

interface ChatsProps {
}

const Chats: FC<ChatsProps> = ({}) => {
    const chats = useContext(ChatContext);
    const navigation = useNavigation();
    const {Load} = useContext(ActiveChatContext);
    const {Auth} = useContext(AuthContext);
    return (
        <View>
            <ChatList onItemPress={async (chat) => {
                if (!Load) return ;
                Load(chat);
                navigation.navigate("Chat", chat);
            }} chats={chats?.data}/>
        </View>
    );
}

export default Chats;
