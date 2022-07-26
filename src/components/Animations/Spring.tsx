import {Animated} from "react-native";
import {useEffect, useRef} from "react";

export const Spring = ({children}) => {
    const springAnim = useRef(new Animated.Value(0)).current  // Initial value for opacity: 0

    useEffect(() => {
        Animated.timing(springAnim, {
            toValue: 1, duration: 50,
            useNativeDriver: false
        }).start();
    }, [springAnim]);
    return (
        <Animated.View style={{
            width: springAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
            }),
        }}>
            {children}
        </Animated.View>
    )
}