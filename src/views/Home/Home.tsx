import React, {useState} from 'react';
import {DevSettings, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {BottomSheet, Input} from "@rneui/base";
// @ts-ignore
import Icon from "@assets/60083e92-e923-4d81-9a70-0be5d11bb749.png";
import {ListItem, Tab, TabView} from "@rneui/themed";
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

const HomeHeader = () => {

}
const Home = ({navigation}) => {
    const [tab, setTab] = useState(0);
    const [dialog, setDialog] = useState(false)
    return (
        <SafeAreaView>
            <View style={{
                paddingLeft: 20,
                paddingRight: 20,
                backgroundColor: Colors.white,
                paddingBottom: 0,
                marginTop: "-10%",
                paddingTop: 0
            }}>
                <AppHeader/>
                <View style={{display: "flex",}}>
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
                <View style={{
                    display: "flex",
                    borderBottomWidth: 1,
                    borderBottomColor: Colors.grey.background
                }}>
                    <Tab
                        value={tab}
                        containerStyle={{backgroundColor: Colors.white}}
                        onChange={(e) => setTab(e)}
                        indicatorStyle={{
                            backgroundColor: Colors.tertiary,
                            height: 3,
                        }}
                        variant="primary">
                        <Tab.Item
                            title={Strings.menu_chats}
                            containerStyle={{backgroundColor: Colors.white}}
                            titleStyle={{fontSize: 12, color: Colors.black}}
                        />
                        <Tab.Item
                            title={Strings.menu_missions}
                            containerStyle={{backgroundColor: Colors.white}}
                            titleStyle={{fontSize: 12, color: Colors.black}}
                        />
                        {/*<Tab.Item*/}
                        {/*    title={Strings.menu_calls}*/}
                        {/*    containerStyle={{backgroundColor: Colors.white}}*/}
                        {/*    titleStyle={{fontSize: 12, color: Colors.black}}*/}
                        {/*/>*/}
                    </Tab>
                </View>
            </View>
            <View style={{height: '100%'}}>
                <TabView value={tab} onChange={setTab} animationType={"spring"}>
                    <TabView.Item style={{backgroundColor: 'transparent', width: '100%'}}>
                        <View><Chats/></View>
                    </TabView.Item>
                    <TabView.Item style={{backgroundColor: 'transparent', width: '100%'}}>
                        <View><Missions/></View>
                    </TabView.Item>
                    {/*<TabView.Item style={{backgroundColor: 'transparent', width: '100%'}}>*/}
                    {/*    <View><Calls/></View>*/}
                    {/*</TabView.Item>*/}
                </TabView>
            </View>
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
        </SafeAreaView>
    );
}

export default Home;
