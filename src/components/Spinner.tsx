import {ActivityIndicator, Dimensions, View} from "react-native";
import React from "react";

export function Spinner(props) {
    return (
        props.relative ? <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundColor: '#fff',
            height: '100%',
            width: '100%'
        }}>
            <ActivityIndicator size="large" color="#f29900"/>
        </View> : <View style={{
            flexDirection: 'row',
            flex: 1,
            height: Dimensions.get("screen").height / 2,
            width: "100%",
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <ActivityIndicator size={"large"} {...props}/>
        </View>
    )
}

export default Spinner;