import React, {FC, useContext} from 'react';
import {Image, View} from "react-native";
import AppIcon from "@assets/60083e92-e923-4d81-9a70-0be5d11bb749.png"
import {Text} from "@rneui/themed";
import Strings from "../../res/strings";
import {Button, CheckBox, Icon, Input} from "@rneui/base";
import Colors from "@res/colors"
import {AuthContext} from "../../../Contexts";
import {useNavigation} from "@react-navigation/native";

interface LoginProps {
    version: string,
    ip: string
}

// @ts-ignore
const LoginComponent: FC<LoginProps> = () => {
    const [checkBox, setCheckBox] = React.useState(true);
    const [creds, setCreds] = React.useState({username: "kabeer", password: "A*1NpxSth7KSK0ga"});
    const [working, setWorking] = React.useState(false);
    const [error, setError] = React.useState(false);
    const {Login} = useContext(AuthContext);
    const navigation = useNavigation();
    return (
        <View style={{
            backgroundColor: "white",
            paddingVertical: "10%",
            paddingHorizontal: 20,
            height: "100%"
        }}>
            <View style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                <Image style={{height: 150, width: 150}} source={AppIcon}/>
            </View>
            <View style={{marginTop: "10%"}}>
                <Text h3>{Strings.login_screen_login}</Text>
                <Text style={{color: "red"}}>{error ? "Username or Password Incorrect" : ""}</Text>
                <View style={{marginTop: "10%"}}>
                    <View style={{display: "flex"}}>
                        <Text style={{marginBottom: 10}}>{Strings.login_screen_username}</Text>
                        <Input
                            value={creds.username}
                            blurOnSubmit={true}
                            autoFocus
                            disabled={working}
                            containerStyle={{
                                borderRadius: 10,
                                height: 50,
                                backgroundColor: Colors.grey.background
                            }}
                            inputContainerStyle={{
                                paddingTop: 5,
                                borderBottomWidth: 0
                            }}
                            onChangeText={username => setCreds({...creds, username: username})}
                        />
                    </View>
                    <View style={{marginTop: "10%", display: "flex"}}>
                        <Text style={{marginBottom: 10}}>{Strings.login_screen_password}</Text>
                        <Input
                            blurOnSubmit={true}
                            value={creds.password}
                            disabled={working}
                            containerStyle={{
                                borderRadius: 10,
                                height: 50,
                                backgroundColor: Colors.grey.background
                            }}
                            inputContainerStyle={{paddingTop: 5, borderBottomWidth: 0}}
                            secureTextEntry
                            onChangeText={password => setCreds({...creds, password: password})}
                        />
                    </View>
                    <View style={{
                        width: "100%",
                        marginVertical: 20,
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "row"
                    }}>
                        <CheckBox
                            checked={checkBox}
                            checkedColor="#0F0"
                            containerStyle={{margin: 0, padding: 0, width: "100%"}}
                            uncheckedIcon={<Icon
                                name={"checkbox-blank-outline"} type={"material-community"}/>}
                            checkedIcon={<Icon
                                type={"material-community"} color={Colors.tertiary} name={"checkbox-marked"}/>}
                            onLongPress={() => console.log("onLongPress()")}
                            onPress={() => setCheckBox(!checkBox)}
                            size={20}
                            disabled={working}
                            title={<Text style={{
                                marginLeft: 20, fontWeight: "200"
                            }}>{Strings.login_screen_remember_me}</Text>}
                            textStyle={{}}
                            titleProps={{}}
                            uncheckedColor="#F00"
                        /></View>
                    <View style={{width: '100%', marginTop: "20%"}}>
                        <Button disabled={working} containerStyle={{borderRadius: 10}} onPress={async () => {
                            setWorking(true);
                            try {
                                await Login({
                                    username: creds.username,
                                    password: creds.password,
                                    rememberMe: checkBox,
                                });
                                navigation.navigate("Home");
                            } catch (e) {
                                console.log("error", e)
                                setError(true);
                            }
                            setWorking(false);
                        }} color={Colors.tertiary}>Login</Button>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default LoginComponent;
