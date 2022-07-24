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
    const {fuse, error} = useContext(ChatContext);
    const {Load} = useContext(ActiveChatContext);
    const [filtered, setFiltered] = useState([]);
    const [query, setQuery] = useState("");
    useEffect(() => {
        if (!fuse) return;
        const results = fuse.search(query);
        setFiltered(results.map(res => res.item));
    }, [query])

    return (
        <SafeAreaView>
            {error ?
                <>
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
                    }}>
                        <Button onPress={() => navigation.goBack()} icon={{name: "arrow-back"}} containerStyle={{
                            width: 50, height: 50,
                            backgroundColor: "transparent"
                        }} color={"transparent"}/>
                    </View>
                    <Text style={{
                        width: "100%",
                        textAlign: "center",
                        marginTop: "40%",
                        color: Colors.error,
                        fontSize: 20
                    }}>Error
                        Loading Chats</Text>
                </> : <>
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
                    }}>
                        <Button onPress={() => navigation.goBack()} icon={{name: "arrow-back"}} containerStyle={{
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
                            inputContainerStyle={{borderBottomWidth: 0}}/>
                    </View>
                    <View style={{
                        height: "100%",
                        marginTop: 20
                    }}>
                        {filtered.length ? <ChatList onItemPress={async (chat) => {
                            if (!Load) return;
                            await Load(chat);
                            navigation.navigate("Chat", chat);
                        }} chats={filtered}/> : <View style={{
                            marginTop: "80%",
                            marginLeft: "30%"
                        }}>
                            <Text>No Results Were Found</Text>
                        </View>}
                    </View>
                </>}
        </SafeAreaView>
    );
}

export default Search;
