import {Icon} from "@rneui/base";
import Colors from "../../res/colors";
import {Actions} from "react-native-gifted-chat";
import React from "react";

export const GiftedChatActions = (props) => {
    return (
        <Actions
            {...props}
            options={{
                'Choose From Library': () => {
                    return ({f: "b"})
                },
                'Take Picture': async () => {
                },
                'Cancel': async () => {
                },
            }}
            icon={() => (<Icon name={'add'} size={28} color={Colors.tertiary}/>)}
            onSend={(props) => {
                console.log("gifted.chat.actions.onsend", props);
                return ({fa: "fb"})
            }}
        />
    )
}