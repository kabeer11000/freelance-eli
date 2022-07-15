import React, {FC} from 'react';
import EndPoints from "../../api/EndPoints";
import {ListItem} from "@rneui/themed";
import {View} from "react-native";


interface ChatsProps {
}

const Chats: FC<ChatsProps> = () => {
    const [chats, setChats] = React.useState([]);
    const fetchChats = async () => {
        const chats = await (await fetch(EndPoints.GetChats({
            token: "GC8RUZ98QWERT",
            lang: "en",
            ip: "123",
            page: "2",
            version: "0.1"
        }), {
            method: 'GET',
            redirect: 'follow'
        })).json();
        setChats(chats.data);
    }
    React.useEffect(() => {
        fetchChats();
    }, []);
    return (
        <View>
            {chats.length ? chats.map(chat => (
                <ListItem key={Math.random()} focusable>
                    <ListItem.Content>
                        <ListItem.Title>{chat.id}</ListItem.Title>
                        <ListItem.Subtitle>{Object.keys(chat.users).join(" ")}</ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron/>
                </ListItem>
            )) : null}
        </View>
    );
}

export default Chats;
