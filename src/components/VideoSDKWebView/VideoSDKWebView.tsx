import React, {FC, useEffect, useRef, useState} from 'react';
import WebView from "react-native-webview";
// import StaticServer from 'react-native-static-server';
import {useLinkTo} from "@react-navigation/native";
import {Text} from "@rneui/base";
import {ActivityIndicator, BackHandler, View} from "react-native";
import {Camera} from "expo-camera";
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

const VideoSDKWebView: FC<VideoSDKWebViewProps> = ({route}) => {
    const {api_key, meeting_id, name} = route.params;
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const webViewRef = useRef(null)
    const linkTo = useLinkTo();
    const [meetingEnded, setMeetingEnded] = useState(false);
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

    // console.log(require("../../../assets/video-sdk-webview-contents/index.html"))

    // const [state, setState] = useState({isLoaded:false});
    if (meetingEnded) return <View style={{
        display: "flex",
    }}><Text h2>This meeting has ended</Text></View>;
    console.log(`https://docs.kabeercloud.tk/tests/freelance-project-videosdk/index.html?api_key=${api_key}&meeting_id=${meeting_id}&name=${name}`)
    return (
        <WebView
            mixedContentMode={"always"}
            bounces={true}
            allowsInlineMediaPlayback
            ref={webViewRef}
            javaScriptEnabled
            scalesPageToFit
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabledAndroid
            useWebkit
            startInLoadingState={true}
            // renderLoading={Spinner}
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
            }}
            originWhitelist={['*']}
            source={{uri: `https://docs.kabeercloud.tk/tests/freelance-project-videosdk/index.html?api_key=${api_key}&meeting_id=${meeting_id}&name=${name}`}}
        />
    );
}

export default VideoSDKWebView;
