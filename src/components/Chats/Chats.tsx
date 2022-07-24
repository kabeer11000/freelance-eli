import React, {FC, useContext} from 'react';
import {Text, View} from "react-native";
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
    return (
        <View style={{display: "flex"}}>
            {chats?.error ?
                <Text style={{width: "100%", textAlign: "center", marginTop: "40%", color: Colors.error, fontSize: 20}}>Error
                    Loading Chats</Text> : <ChatList onItemPress={async (chat) => {
                    if (!Load) return;
                    await Load(chat);
                    navigation.navigate("Chat", chat);
                }} chats={chats?.data}/>}
        </View>
    );
}

export default Chats;
