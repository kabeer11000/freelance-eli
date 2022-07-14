import React, {FC} from 'react';
import {
    FlatList,
    Text,
    View,
    Button as ButtonNative,
    TouchableNativeFeedback,
    TouchableHighlight,
    TouchableOpacity, TouchableOpacityComponent
} from "react-native";
import {Avatar, ListItem, Tab} from "@rneui/themed";
import Colors from "../../res/colors";
import {Button, Icon} from "@rneui/base";


interface MissionsProps {
}

const missions = [
    {title: "Mission 1"},
    {title: "Another Mission"},
    {title: "Mission 3"},
    {title: "Mission 4"},
    {title: "Mission 6"},
    {title: "Mission 6"},
]
const chats = [
    {
        name: 'Amy Farha',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
        subtitle: 'Vice President'
    },
    {
        name: 'Chris Jackson',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        subtitle: 'Vice Chairman'
    },
]
const Missions: FC<MissionsProps> = () => {
    const [tab, setTab] = React.useState(0);
    return (
        <View style={{
            height: '100%'
        }}>
            <View style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                paddingLeft: 0,
                paddingRight: 0
            }}>
                <Button disabled={tab === 0} onPress={() => setTab(tab -1)} style={{
                    left: 0,
                    backgroundColor: "transparent"
                }}><ListItem.Chevron underlayColor={"transparent"}/></Button>
                <View style={{
                    display: "flex",
                    flexDirection: "row",
                    paddingLeft: 0,
                    width: "85%",
                    paddingRight: 0
                }}>
                    <Tab
                        scrollable={true}
                        value={tab}
                        containerStyle={{
                            backgroundColor: Colors.white
                        }}

                        onChange={(e) => setTab(e)}
                        indicatorStyle={{
                            backgroundColor: Colors.primary,
                            height: 3,
                        }}
                        variant="primary"
                    >{missions.map(mission => <Tab.Item
                        title={mission.title}
                        key={Math.random()}
                        variant={"primary"}
                        containerStyle={{backgroundColor: Colors.white}}
                        titleStyle={{fontSize: 12, color: Colors.black}}
                    />)}
                    </Tab>
                </View>
                <Button disabled={tab === missions.length -1} onPress={() => setTab(tab + 1)} style={{
                    right: 0,
                    backgroundColor: "transparent"
                }}><ListItem.Chevron /></Button>
            </View>
            <View>
                <FlatList data={chats} renderItem={({item}) => (
                    <ListItem bottomDivider focusable>
                        <Avatar source={{uri: item.avatar_url}} />
                        <ListItem.Content>
                            <ListItem.Title>{item.name}</ListItem.Title>
                            <ListItem.Subtitle>{item.subtitle}</ListItem.Subtitle>
                        </ListItem.Content>
                        <ListItem.Chevron />
                    </ListItem>
                )}/>
            </View>
        </View>
    );
}

export default Missions;
