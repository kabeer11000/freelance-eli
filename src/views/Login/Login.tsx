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
    const [creds, setCreds] = React.useState({username: "jay", password: "pass0364"});
    const [error, setError] = React.useState(false);
    const {Login} = useContext(AuthContext);
    const navigation = useNavigation();
    return (
        <View style={{
            backgroundColor: "white"
        }}>
            <View style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                height: 100,
                flexGrow: 1,
                marginTop: "10%",
                width: "100%"
            }}><Image style={{
                height: 200,
                width: 200
            }} source={AppIcon}/></View>
            <View style={{
                padding: 20,
                height: "100%",
                marginTop: "30%"
                // display: "flex",
                // flexDirection: "column",
            }}>
                <Text h3>{Strings.login_screen_login}</Text>
                <View style={{
                    marginTop: "15%"
                }}>
                    <View style={{
                        display: "flex",
                    }}>
                        <Text style={{
                            marginBottom: 10
                        }}>{Strings.login_screen_username}</Text>
                        <Input
                            value={creds.username}
                            blurOnSubmit={true}
                            errorMessage={error ? "Username or Password Incorrect" : ""}
                            renderErrorMessage={error}
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
                    <View style={{
                        marginTop: "10%",
                        display: "flex",
                    }}>
                        <Text style={{
                            marginBottom: 10
                        }}>{Strings.login_screen_password}</Text>
                        <Input

                            errorMessage={error ? "Username or Password Incorrect" : ""}
                            renderErrorMessage={error}
                            blurOnSubmit={true}
                            value={creds.password}
                            containerStyle={{
                                borderRadius: 10,
                                height: 50,
                                backgroundColor: Colors.grey.background
                            }}
                            inputContainerStyle={{
                                paddingTop: 5,
                                borderBottomWidth: 0
                            }}
                            secureTextEntry
                            onChangeText={password => setCreds({...creds, password: password})}
                        />
                    </View>
                    <CheckBox
                        style={{
                            padding: 0,
                            margin: 0,
                            marginTop: 20
                        }}
                        checked={checkBox}
                        checkedColor="#0F0"
                        containerStyle={{ width: "100%" }}
                        onLongIconPress={() =>
                            console.log("onLongIconPress()")
                        }
                        uncheckedIcon={<Icon name={"check_box_outline_blank"}/>}
                        checkedIcon={<Icon color={Colors.tertiary} name={"done"}/>}
                        onLongPress={() => console.log("onLongPress()")}
                        onPress={() => setCheckBox(!checkBox)}
                        size={30}
                        title={<Text style={{
                            marginLeft: 20
                        }}>{Strings.login_screen_remember_me}</Text>}
                        textStyle={{}}
                        titleProps={{}}
                        uncheckedColor="#F00"
                    />
                    <View style={{
                        width: '100%',
                        marginTop: "20%"
                    }}>
                        <Button containerStyle={{
                            borderRadius: 10
                        }} onPress={async () => {
                            try {
                                console.log("trying to login")
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
                        }} color={Colors.tertiary}>Login</Button>
                    </View>
                    {/*<Text>{Strings.login_screen_remember_me}</Text><CheckBox checked={false}></CheckBox>*/}
                </View>
            </View>
        </View>
    );
}

export default LoginComponent;
