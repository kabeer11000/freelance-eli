import React, {FC} from "react";

import {ScrollView, TouchableHighlight, View} from "react-native";
import {Spring} from "../Animations/Spring";


interface TabsProps {
}

const Tabs: FC<TabsProps> = ({
                                 children,
                                 index,
                                 scrollable,
                                 onIndexChange,
                                 indicator, surfaceProps,
                             }: { index: number, indicator?: boolean, style?: object, surfaceProps?: object, onIndexChange: (n: number) => any, children: React.ReactChildren }) => {
    if (scrollable === undefined) scrollable = true
    return (
        // @ts-ignore
        <View style={{backgroundColor: "transparent"}}>
            {scrollable ? <ScrollView horizontal>
                {React.Children.toArray(children).map((child, i) => (
                    <TouchableHighlight onPress={() => onIndexChange(i)} key={i}>
                        <View style={{
                            width: 100,
                            marginHorizontal: 0,
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "row",
                        }}>
                            <TabOption indicator={indicator} active={index === i}>{child}</TabOption>
                        </View>
                    </TouchableHighlight>
                ))}
            </ScrollView> : <View style={{
                ...surfaceProps,
                display: "flex",
                backgroundColor: "transparent",
                flexDirection: "row",
                justifyContent: "space-around"
            }}>
                {React.Children.toArray(children).map((child, i) => (
                    <TouchableHighlight style={{}} onPress={() => onIndexChange(i)} key={i}>
                        <View style={{
                            width: "100%",
                            marginHorizontal: 0,
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "row",
                        }}>
                            <TabOption indicator={indicator} active={index === i}>{child}</TabOption>
                        </View>
                    </TouchableHighlight>
                ))}
            </View>}
        </View>
    );
}

export const TabOption = ({
                              indicator,
                              active,
                              children
                          }: { indicator: boolean, active: boolean, children: React.ReactChildren }) => (
    <View style={{
        display: "flex",
        flexDirection: "column",
        padding: 5,
        justifyContent: "space-around",
        height: 50
    }}>
        <View style={{width: "100%"}}>{children}</View>
        {active && indicator ? <Spring>
            <View style={{
                width: "100%",
                height: 2.5,
                backgroundColor: "white",
            }}/>
        </Spring> : null}</View>
);

export const TabPanel = ({
                             children,
                             index,
                             value,
                             ...props
                         }: { children: React.ReactChildren, index: number, value: number }) => {
    // @ts-ignore
    return (index === value) ? <View {...props}>{children}</View> : null
}
export default Tabs;
