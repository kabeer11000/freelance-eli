import {ActivityIndicator, Dimensions, View} from "react-native";

export function Spinner(props) {
    return (
        <View style={{
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