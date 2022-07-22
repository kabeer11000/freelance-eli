import {KeyboardAvoidingView, Platform, StatusBar} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from "react";
import * as SplashScreen from 'expo-splash-screen';
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from "@views/Home/Home";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import Chat from "./src/components/Chat/Chat";
import {ActiveChatProvider, AuthContext, AuthProvider, ChatProvider} from "./Contexts";
import Login from "./src/views/Login/Login";
import {createTheme, ThemeProvider} from "@rneui/themed";
import VideoSDKWebView from "./src/components/VideoSDKWebView/VideoSDKWebView";
import Search from "./src/views/Search/Search";

export const Stack = createNativeStackNavigator();

const AuthenticatedNavigator = () => {
    const {Auth} = useContext(AuthContext);
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            {Auth?.status ? (
                <>
                    <Stack.Screen name={"Home"} component={Home}/>
                    <Stack.Screen name={"Chat"} component={Chat}/>
                    <Stack.Screen name={"Search"} component={Search}/>
                    <Stack.Screen name={"VideoSDKWebView"} component={VideoSDKWebView}/>
                    <Stack.Screen name={"Login"} component={Login}/>
                </>
            ) : (
                <>
                    <Stack.Screen name={"Login"} component={Login}/>
                </>
            )
            }
        </Stack.Navigator>
    )
}

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
            // navigationQueue.map(([name, param]) => navigate(name, param));
        }
    }, [appIsReady]);
    if (!appIsReady) return null;
    const theme = createTheme({colors: {background: "#fff"}});
    return (
        <SafeAreaProvider>
            <NavigationContainer onReady={onLayoutRootView}>
                <ThemeProvider theme={theme}>
                    <SafeAreaView style={{backgroundColor: "#fff", minHeight: '100%', width: '100%'}}>
                        <AuthProvider>
                            <ChatProvider>
                                <ActiveChatProvider>
                                    <AuthenticatedNavigator/>
                                </ActiveChatProvider>
                            </ChatProvider>
                        </AuthProvider>
                    </SafeAreaView>
                </ThemeProvider>
                <StatusBar/>
            </NavigationContainer>
            {Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" />}
        </SafeAreaProvider>
    );
}