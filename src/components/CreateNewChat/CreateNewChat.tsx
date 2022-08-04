import React, {FC, useContext, useState} from 'react';
import {ScrollView, TouchableWithoutFeedback, View} from "react-native";
import {ActiveChatContext, AuthContext} from "../../../Contexts";
import {Avatar, ListItem} from "@rneui/themed";
import {Button, Header, Icon} from "@rneui/base";
import {toFormData} from "../../Utils";
import {useNavigation} from "@react-navigation/native";


interface CreateNewChatProps {
}

const Selectable = ({selected, onSelect, children}) => <TouchableWithoutFeedback onPress={onSelect}>
    <View style={{opacity: selected ? .5 : 1, backgroundColor: selected ? "lightgreen" : "transparent"}}>
        {children}
    </View>
</TouchableWithoutFeedback>
const CreateNewChat: FC<CreateNewChatProps> = () => {
    const {Auth} = useContext(AuthContext);
    const [selected, setSelected] = useState([]);
    const [selU, setSelU] = useState(null);
    const {Load} = useContext(ActiveChatContext);
    const navigation = useNavigation();
    return (
        <View style={{display: "flex", justifyContent: "space-evenly"}}>
            <Header
                backgroundImageStyle={{}}
                barStyle="dark-content"
                centerComponent={{
                    text: "Create New Conversation",
                    style: {color: "black", fontSize: 25, marginTop: -5, width: "100%"}
                }}
                backgroundColor={"white"}
                containerStyle={{width: "100%", elevation: 5}}
                leftComponent={<Button color={"transparent"} size={"sm"} icon={<Icon name={"arrow-back"}/>}/>}
                leftContainerStyle={{}}
                linearGradientProps={{}}
                placement="left"
                rightContainerStyle={{}}
                statusBarProps={{}}
            />
            <ScrollView>
                {Auth?.team_members ? Auth.team_members.map((user, index) => (
                    <Selectable selected={selU === index} onSelect={() => setSelU(index)} key={index}>
                        <ListItem>
                            <Avatar source={{uri: user.profile_image}}/>
                            <ListItem.Content>
                                <ListItem.Title>{user.name}</ListItem.Title>
                                <ListItem.Subtitle>{user.id}</ListItem.Subtitle>
                            </ListItem.Content>
                        </ListItem>
                    </Selectable>
                )) : null}
            </ScrollView>
            {selU ? <View style={{
                width: "100%",
                elevation: 5,
                backgroundColor: "white",
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end"
            }}>
                <Button onPress={async () => {
                    if (!Auth?.status) return;
                    const formData = toFormData({
                        token: Auth.token,
                        lang: Auth.app_lang,
                        ip: "123",
                        version: "0.1",
                        owner: Auth.id, //Object.keys(state.data.users)[0],
                        message: Auth.user_name + " Created A New Chat" || "",
                        recipient_id: Auth.team_members[selU].id,
                    });
                    const response = await fetch("https://bull36.com/app/add_chat", {
                        method: 'POST',
                        headers: {
                            "Content-Type": "multipart/form-data"
                        },
                        body: formData,
                        redirect: 'follow'
                    });
                    const res = response.ok ? await response.json() : null;
                    if (res.status) {
                        await Load(res.data, {oid: false});
                        navigation.navigate("Chat", {})
                    }

                    console.log("new chat ", res);
                    /** Send Add Message Request attach formdata to body TODO **/
                }} containerStyle={{padding: 2, marginRight: 20}} color={"transparent"}
                        titleStyle={{color: "black"}}>Create</Button>
            </View> : null}
        </View>
    );
}

export default CreateNewChat;
/*
selected={selected.findIndex(i => i === index) !== -1}
                                onSelect={() => {
                                    if (selected.findIndex(i => i === index) === -1) setSelected([...selected, index]);
                                    else setSelected(selected.filter(i => i !== index));
                                }}
 */