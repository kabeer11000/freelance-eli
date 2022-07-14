import {StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useState} from "react";
import * as SplashScreen from 'expo-splash-screen';
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from "@views/Home/Home";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import Chat from "./src/components/Chat/Chat";
import {AuthProvider} from "./Contexts";
import Login from "./src/views/Login/Login";
import {createTheme, ThemeProvider} from "@rneui/themed";

export const Stack = createNativeStackNavigator();

// const H = () => <Text>Home</Text>;
// const L = () => <Text>Login</Text>;

export default function App() {
    const [appIsReady, setAppIsReady] = useState(false);

    useEffect(() => {
        async function prepare() {
            try {
                // Keep the splash screen visible while we fetch resources
                await SplashScreen.preventAutoHideAsync();
                // Pre-load fonts, make any API calls you need to do here
                // await Font.loadAsync(Entypo.font);
                // Artificially delay for two seconds to simulate a slow loading
                // experience. Please remove this if you copy and paste the code!
                // await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (e) {
                console.warn(e);
            } finally {
                // Tell the application to render
                setAppIsReady(true);
            }
        }

        prepare();
    }, []);
    const onLayoutRootView = useCallback(async () => {
        if (appIsReady) {
            // This tells the splash screen to hide immediately! If we call this after
            // `setAppIsReady`, then we may see a blank screen while the app is
            // loading its initial state and rendering its first pixels. So instead,
            // we hide the splash screen once we know the root view has already
            // performed layout.
            await SplashScreen.hideAsync();
        }
    }, [appIsReady]);

    if (!appIsReady) {
        return null;
    }
    const theme = createTheme({
        colors: {
            background: "#fff"
        }
    })
    return (
        <SafeAreaProvider>
            <NavigationContainer onReady={onLayoutRootView}>
                <AuthProvider>
                    <ThemeProvider theme={theme}>
                        <SafeAreaView style={{flex: 1, backgroundColor: "#fff", minHeight: '100%', width: '100%'}}>
                            <Stack.Navigator initialRouteName={"Login"} screenOptions={{
                                headerShown: false
                            }} defaultScreenOptions={{
                                headerShown: false
                            }}>
                                <Stack.Screen name={"Home"} component={Home}/>
                                <Stack.Screen name={"Chat"} initialParams={{
                                    user: {
                                        name: "Kabeer Jaffri",
                                        id: "app"
                                    },
                                    remoteUserId: "f02a76c5-9c98-4268-83e0-3069fbe9b0a7"
                                }} component={Chat}/>
                                <Stack.Screen name={"Login"} component={Login}/>
                            </Stack.Navigator>
                        </SafeAreaView>
                    </ThemeProvider>
                </AuthProvider>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
