import React, {FC, useContext, useEffect, useState} from 'react';
import {SafeAreaView} from "react-native-safe-area-context";
import Colors from "../../res/colors";
import {View} from "react-native";
import {Button, Input, Text} from "@rneui/base";
import Strings from "../../res/strings";
import {ActiveChatContext, ChatContext} from "../../../Contexts";
import ChatList from "../../components/Chats/ChatList";

interface SearchProps {
}

const Search: FC<SearchProps> = ({navigation}) => {
    const {fuse} = useContext(ChatContext);
    const {Load} = useContext(ActiveChatContext);
    const [filtered, setFiltered] = useState([]);
    const [query, setQuery] = useState("");
    useEffect(() => {
        const results = fuse.search(query);
        setFiltered(results.map(res => res.item));
    }, [query])

    return (
        <SafeAreaView>
            <View style={{
                display: "flex",
                backgroundColor: Colors.white,
                width: "100%",
                position: "absolute",
                height: 60,
                zIndex: 999,
                top: 0,
                paddingTop: 10,
                paddingRight: 50,
                borderBottomWidth: 1,
                borderBottomColor: Colors.grey.background,
                justifyContent: "flex-start",
                flexDirection: "row",
                width: "100%"
            }}>
                <Button onPress={() => {
                    navigation.goBack()
                }} icon={{
                    name: "arrow-back"
                }} containerStyle={{
                    width: 50, height: 50,
                    backgroundColor: "transparent"
                }} color={"transparent"}/>
                <Input
                    placeholder={Strings.search_bar_search}
                    blurOnSubmit={true}
                    autoFocus={true}
                    autoComplete={"birthdate-day"}
                    containerStyle={{
                        height: 60,
                        width: "100%"
                    }}
                    onChangeText={text => setQuery(text)}
                    inputContainerStyle={{borderBottomWidth: 0}}
                />
            </View>
            <View style={{
                height: "100%",
                marginTop: 20
            }}>
                {filtered.length ? <ChatList onItemPress={(chat) => {
                    if (!Load) return;
                    Load(chat);
                    navigation.navigate("Chat", chat);
                }} chats={filtered}/> : <View style={{
                    marginTop: "80%",
                    marginLeft: "30%"
                }}><Text>No Results Were Found</Text></View>}
            </View>
        </SafeAreaView>
    );
}

export default Search;
