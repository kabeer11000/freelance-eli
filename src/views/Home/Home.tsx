import React, {useState} from 'react';
import {DevSettings, Dimensions, View} from "react-native";
import {BottomSheet, Input} from "@rneui/base";
// @ts-ignore
import Icon from "@assets/60083e92-e923-4d81-9a70-0be5d11bb749.png";
import {ListItem,} from "@rneui/themed";
// @ts-ignore
import Colors from "@res/colors";
// @ts-ignore
import Chats from "@components/Chats/Chats";
// @ts-ignore
import Missions from "@components/Missions/Missions";
// @ts-ignore
import Calls from "@components/Calls/Calls";
import Strings from "@res/strings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppHeader from "@components/Header/Header"
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';

const HomeHeader = () => {
}

const renderScene = SceneMap({
    Chats: Chats,
    Missions: Missions,
});
const TabContainer = () => {
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        {key: 'Chats', title: 'Chats'},
        {key: 'Missions', title: 'Missions'},
    ]);
    return <TabView
        lazy
        renderTabBar={(props) => <TabBar style={{
            backgroundColor: "white",
        }} labelStyle={{color: "black"}} indicatorStyle={{backgroundColor: Colors.tertiary}} {...props}/>}
        style={{flex: 1, height: "100%"}}
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: "100%", height: "100%", flex: 1,}}
    />
}

const Home = ({navigation}) => {
    const [tab, setTab] = useState(0);
    const [dialog, setDialog] = useState(false)
    return (
        <View>
            <View style={{
                paddingLeft: 20,
                paddingRight: 20,
                backgroundColor: Colors.white,
                paddingBottom: 0,
                height: 125,
                paddingTop: 0
            }}>
                <AppHeader/>
                <View style={{display: "flex"}}>
                    <Input
                        placeholder={Strings.search_bar_search}
                        blurOnSubmit={true}
                        onPressIn={() => navigation.navigate("Search")}
                        containerStyle={{
                            borderRadius: 10,
                            height: 50,
                            backgroundColor: Colors.grey.background
                        }}
                        inputContainerStyle={{borderBottomWidth: 0}}
                        leftIcon={{type: 'material', name: 'search'}}
                    />
                </View>
            </View>
            <View style={{
                flex: 1,
                flexGrow: 1,
                minHeight: Dimensions.get("window").height - 125,
                display: "flex",
            }}><TabContainer/></View>
            <BottomSheet modalProps={{}} onBackdropPress={() => setDialog(false)} isVisible={dialog}>
                <View style={{backgroundColor: Colors.white}}>
                    <ListItem onPress={async () => {
                        await AsyncStorage.removeItem('app.usercreds');
                        // navigation.navigate("Home");
                        setDialog(false);
                        DevSettings.reload();
                    }}>
                        <ListItem.Content>
                            <ListItem.Title>Log Out</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                </View>
            </BottomSheet>
        </View>
    );
}

export default Home;
