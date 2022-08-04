import React, {FC, useContext, useState} from 'react';
import {RefreshControl, Text} from "react-native";
import {ActiveChatContext, ChatContext} from "../../../Contexts";
import ChatList from "./ChatList";
import {useNavigation} from "@react-navigation/native";
import Colors from "../../res/colors";

interface ChatsProps {
}

const Chats: FC<ChatsProps> = ({}) => {
    const chats = useContext(ChatContext);
    const navigation = useNavigation();
    const {Load} = useContext(ActiveChatContext);
    const [refreshing, setRefreshing] = useState(false);
    return chats?.error ?
        <Text style={{width: "100%", textAlign: "center", marginTop: "40%", color: Colors.error, fontSize: 20}}>Error
            Loading Chats</Text> : <ChatList refreshControl={
            <RefreshControl
                refreshing={refreshing}
                onRefresh={async () => {
                    setRefreshing(true)
                    await chats.LoadChats({page: 0});
                    setRefreshing(false)
                }}
            />
        } onItemPress={async (chat) => {
            if (!Load) return;
            await Load(chat);
            navigation.navigate("Chat", chat);
        }} chats={chats?.data}/>
}

export default Chats;
