import React, {FC, useEffect, useRef, useState} from 'react';
import WebView from "react-native-webview";
// import StaticServer from 'react-native-static-server';
import {useLinkTo} from "@react-navigation/native";
import {Button, Text} from "@rneui/base";
import {ActivityIndicator, BackHandler, View} from "react-native";
import {Camera} from "expo-camera";
import Colors from "../../res/colors";
import {SafeAreaView} from "react-native-safe-area-context";
// import RNFS from 'react-native-fs';
// let path = RNFS.MainBundlePath + '/www';

// let server = new StaticServer(8080);

interface VideoSDKWebViewProps {
    api_key: string,
    meeting_id: string,
    name: string
}

const Spinner = () => (
    <View style={{
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
    </View>
);

const VideoSDKWebView: FC<VideoSDKWebViewProps> = ({navigation, route}) => {
    const {api_key, meeting_id, name, title} = route.params;
    const [hasPermission, setHasPermission] = useState(null);
    const webViewRef = useRef(null)
    const linkTo = useLinkTo();
    const [meetingEnded, setMeetingEnded] = useState(false);
    const [loaded, setLoaded] = useState(false)
    useEffect(() => {
        (async () => {
            const {status: cameraStatus} = await Camera.requestCameraPermissionsAsync();
            const {status: micStatus} = await Camera.requestMicrophonePermissionsAsync();
            setHasPermission(cameraStatus === 'granted' && micStatus === "granted");
        })();
    }, []);
    useEffect(() => {
        const backAction = () => {
            if (webViewRef.current.canGoBack) webViewRef.current.goBack();
            return true;
        };
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, []);

    if (hasPermission === null) {
        return <View/>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }
    if (meetingEnded) return <View style={{display: "flex"}}><Text h2>This meeting has ended</Text></View>;
    console.log(`https://docs.kabeercloud.tk/tests/freelance-project-videosdk/index.html?api_key=${api_key}&meeting_id=${meeting_id}&name=${name}`)
    return (
        <SafeAreaView>
            <View style={{
                display: "flex",
                backgroundColor: Colors.white,
                width: "100%",
                position: "absolute",
                height: 60,
                zIndex: 999,
                top: 0,
                paddingTop: 10,
                justifyContent: "space-between",
                flexDirection: "row",
                borderBottomColor: Colors.grey.background,
                borderBottomWidth: 1,
                shadowColor: Colors.black,
                shadowOffset: {
                    width: 0,
                    height: 1,
                },
                shadowOpacity: 0.20,
                shadowRadius: 1.41,
                elevation: 2,
            }}>
                <View style={{
                    display: "flex",
                    width: "50%",
                    justifyContent: "flex-start",
                    flexDirection: "row",
                    elevation: 5
                }}>
                    <Button onPress={() => navigation.goBack()} icon={{name: "arrow-back"}} containerStyle={{
                        width: 50, height: 50,
                        backgroundColor: "transparent"
                    }} color={"transparent"}/>
                    <Text h4 style={{marginLeft: 30}}>
                        {title ?? "On Call"}
                    </Text>
                </View>
            </View>
            <View style={{height: "97.25%", marginTop: 25, width: "100%", display: "flex", backgroundColor: "black"}}>
                <WebView
                    mixedContentMode={"always"}
                    bounces={true}
                    onLoad={() => setLoaded(true)}
                    containerStyle={loaded ? {} : {width: 0, height: 0}}
                    allowsInlineMediaPlayback
                    ref={webViewRef}
                    javaScriptEnabled
                    scalesPageToFit
                    mediaPlaybackRequiresUserAction={false}
                    javaScriptEnabledAndroid
                    useWebkit
                    startInLoadingState={true}
                    cacheEnabled={false}
                    renderLoading={Spinner}
                    javaScriptCanOpenWindowsAutomatically={true}
                    style={{
                        width: "100%",
                        height: "100%"
                    }}
                    onMessage={(e: { nativeEvent: { data?: string } }) => {
                        if (e.nativeEvent.data === "MEETING_ENDED") {
                            linkTo("/Home");
                            setMeetingEnded(true);
                        }
                        if (e.nativeEvent.data === "LOADED_EVERYTHING") setLoaded(true);
                    }}
                    originWhitelist={['*']}
                    source={{uri: `https://docs.kabeercloud.tk/tests/freelance-project-videosdk/index.html?api_key=${api_key}&meeting_id=${meeting_id}&name=${name}`}}
                /></View>
        </SafeAreaView>
    );
}

export default VideoSDKWebView;
