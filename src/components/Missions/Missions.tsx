import React, {FC, useContext, useEffect, useState} from 'react';
import {Image, Text, View} from "react-native";
import {Card, Tab, TabView} from "@rneui/themed";
import Colors from "@res/colors";
import {Button} from "@rneui/base";
import ChevronLeft from "@assets/chevron_left_FILL0_wght400_GRAD0_opsz48.png";
import ChevronRight from "@assets/chevron_right_FILL0_wght400_GRAD0_opsz48.png";
import {ActiveChatContext, ChatContext} from "../../../Contexts";
import {IChat} from "../../../Types";
import ChatList from "../Chats/ChatList.lazy";
import {useNavigation} from "@react-navigation/native";
import Spinner from "../Spinner";


interface MissionsProps {
}

const Missions: FC<MissionsProps> = () => {
    const [tab, setTab] = React.useState(0);
    const chats = useContext(ChatContext);
    const [projects, setProjects] = useState<Array<{ projectId: string | number, chats: Array<IChat> }> | null>(null);
    const navigation = useNavigation();
    const {Load} = useContext(ActiveChatContext);
    useEffect(() => {
        if (!chats?.data) return;
        const projectsUnique = [...new Set(chats.data.map((chat, index) => chat.project_id))];
        setProjects(projectsUnique.map(projectId => ({
            projectId: projectId,
            chats: chats.data.filter(chat => chat.project_id === projectId)
        })));
    }, [chats])
    return (
        chats?.error ?
            <Text style={{width: "100%", textAlign: "center", marginTop: "40%", color: Colors.error, fontSize: 20}}>Error
                Loading Missions</Text> :
            projects ? <View style={{height: '100%'}}>
                <Card containerStyle={{padding: 0, margin: 0, borderColor: "transparent"}}
                      wrapperStyle={{elevation: 0, zIndex: 9999}}>
                    <View style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        width: "100%",
                        paddingLeft: 20,
                        paddingRight: 20
                    }}>
                        <Button disabled={tab === 0} color={"transparent"} onPress={() => setTab(tab - 1)}>
                            <Image source={ChevronLeft} style={{
                                width: 30,
                                height: 35
                            }}/>
                        </Button>
                        <View style={{
                            display: "flex",
                            flexDirection: "row",
                            paddingLeft: 0,
                            width: "85%",
                            paddingRight: 0,
                        }}>
                            <Tab
                                scrollable={true}
                                value={tab}
                                containerStyle={{backgroundColor: "transparent"}}
                                onChange={(e) => setTab(e)}
                                indicatorStyle={{
                                    backgroundColor: Colors.primary,
                                    height: 3,
                                }}
                                variant="primary">
                                {projects?.map(({projectId}) => (
                                    <Tab.Item
                                        title={<View style={{
                                            width: "100%",
                                            marginHorizontal: 10,
                                            marginVertical: 7,
                                            textAlign: "center"
                                        }}><Text
                                            style={{textAlign: "center"}}>{`Project ${projectId}`.toUpperCase()}</Text></View>}
                                        key={`project-${projectId}`}
                                        variant={"primary"}
                                        containerStyle={{backgroundColor: "transparent"}}
                                        titleStyle={{fontSize: 13, fontWeight: "lighter", color: Colors.black}}
                                    />
                                ))}
                            </Tab>
                        </View>
                        <Button disabled={tab === projects.length - 1} color={"transparent"}
                                onPress={() => setTab(tab + 1)}>
                            <Image source={ChevronRight} style={{
                                width: 30,
                                height: 35
                            }}/>
                        </Button>
                    </View>
                </Card>
                <TabView animationConfig={{delay: 0, duration: 0, damping: 1, stiffness: 1}} disableSwipe value={tab}
                         disableTransition onChange={setTab}>
                    {projects?.map(({projectId, chats}) => (
                        <TabView.Item key={`project-${projectId}`}
                                      style={{backgroundColor: 'transparent', width: '100%'}}>
                            <ChatList onItemPress={(chat) => {
                                if (!Load) return;
                                Load(chat);
                                navigation.navigate("Chat", {multi: true});
                            }} chats={chats}/>
                        </TabView.Item>
                    ))}
                </TabView>
            </View> : <Spinner/>
    );
}

export default Missions;
