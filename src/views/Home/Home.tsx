import React, {useState} from 'react';
import {Image, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Header, Input} from "@rneui/base";
// @ts-ignore
import Icon from "@assets/60083e92-e923-4d81-9a70-0be5d11bb749.png";
import {Icon as IconComponent, Tab, TabView, Text as ThemedText} from "@rneui/themed";
// @ts-ignore
import Colors from "@res/colors";
// @ts-ignore
import Chats from "@components/Chats/Chats";
// @ts-ignore
import Missions from "@components/Missions/Missions";
// @ts-ignore
import Calls from "@components/Calls/Calls";

import Strings from "@res/strings";

const Home = () => {
    const [tab, setTab] = useState(0);
    return (
        <SafeAreaView>
            <View style={{
                backgroundColor: Colors.white,
                paddingBottom: 0
            }}>
                <Header
                    style={{
                        maxHeight: 50,
                    }}
                    containerStyle={{
                        height: 60,
                        marginBottom: 10
                    }}
                    backgroundColor={"transparent"}
                    leftComponent={
                        <View style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-around",
                            width: 125,
                            maxHeight: 50
                        }}><Image source={Icon} style={{
                            height: 50,
                            width: 50
                        }}/><ThemedText h3>{Strings.app_title}</ThemedText></View>
                    }
                    rightComponent={
                        <View style={{
                            maxHeight: 50,
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-around",
                            width: 125
                        }}>
                            <IconComponent style={{height: 50}} name={"notifications"}/>
                            <IconComponent style={{height: 50}} name={"menu"}/>
                        </View>
                    }
                />
                <View style={{
                    display: "flex",
                    paddingLeft: 20,
                    paddingRight: 20
                }}>
                    <Input
                        placeholder={Strings.search_bar_search}
                        blurOnSubmit={true}
                        containerStyle={{
                            borderRadius: 10,
                            height: 50,
                            backgroundColor: Colors.grey.background
                        }}
                        inputContainerStyle={{
                            borderBottomWidth: 0
                        }}
                        leftIcon={{type: 'material', name: 'search'}}
                        onChangeText={console.log}
                    />
                </View>
                <View style={{
                    display: "flex",
                    paddingLeft: 20,
                    paddingRight: 20,
                    borderBottomWidth: 1,
                    borderBottomColor: Colors.grey.background
                }}>
                    <Tab
                        value={tab}
                        containerStyle={{
                            backgroundColor: Colors.white
                        }}

                        onChange={(e) => setTab(e)}
                        indicatorStyle={{
                            backgroundColor: Colors.tertiary,
                            height: 3,
                        }}
                        variant="primary"
                    >
                        <Tab.Item
                            title={Strings.missions}
                            containerStyle={{backgroundColor: Colors.white}}
                            titleStyle={{ fontSize: 12, color: Colors.black}}
                        />
                        <Tab.Item
                            title={Strings.menu_calls}
                            containerStyle={{backgroundColor: Colors.white}}
                            titleStyle={{ fontSize: 12, color: Colors.black}}
                        />
                        <Tab.Item
                            title={Strings.menu_chats}
                            containerStyle={{backgroundColor: Colors.white}}
                            titleStyle={{ fontSize: 12, color: Colors.black}}
                        />
                    </Tab>
                </View>
            </View>
            <View style={{
                height: '100%'
            }}>
                <TabView disableSwipe value={tab} onChange={setTab} animationType={"spring"}>
                    <TabView.Item style={{ backgroundColor: 'transparent', width: '100%' }}>
                        <Chats/>
                    </TabView.Item>
                    <TabView.Item style={{ backgroundColor: 'transparent', width: '100%' }}>
                        <Missions/>
                    </TabView.Item>
                    <TabView.Item style={{ backgroundColor: 'transparent', width: '100%' }}>
                        <Calls/>
                    </TabView.Item>
                </TabView>
            </View>
        </SafeAreaView>
    );
}

export default Home;
