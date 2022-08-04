import {Image, View} from "react-native";
import {Header as ThemedHeader, Icon as IconComponent, Text as ThemedText} from "@rneui/themed";
import React from "react";

import AppIcon from "@assets/60083e92-e923-4d81-9a70-0be5d11bb749.png";
import Strings from "@res/strings";
import {useNavigation} from "@react-navigation/native";
import {Button} from "@rneui/base";

export const Header = ({onMenuPress}) => {
    const navigation = useNavigation();
    return (
        <ThemedHeader
            containerStyle={{
                height: 60,
                marginTop: 0,
                marginBottom: 10,
                borderBottomWidth: 0,
            }}
            backgroundColor={"transparent"}
            leftComponent={
                <View style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    width: 100,
                    maxHeight: 50
                }}>
                    <Image source={AppIcon} style={{
                        height: 40,
                        width: 40
                    }}/>
                    <ThemedText h4>{Strings.app_title}</ThemedText>
                </View>
            }
            rightComponent={
                <View style={{
                    maxHeight: 50,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    width: 60,
                }}>
                    {/*<IconComponent style={{height: 50}} name={"notifications"}/>*/}
                    <Button style={{height: 50}} color={"transparent"} onPress={() => {
                        navigation.navigate("CreateNewChat");
                    }} icon={<IconComponent style={{height: 50}} name={"add"}/>}/>
                    <Button style={{height: 50}} color={"transparent"} onPress={onMenuPress}
                            icon={<IconComponent style={{height: 50}} name={"menu"}/>}/>
                </View>
            }
        />
    )
}
export default Header;