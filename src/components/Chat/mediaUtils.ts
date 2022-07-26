import * as ImagePicker from 'expo-image-picker';

export async function pickImageAsync() {
    if (await ImagePicker.requestMediaLibraryPermissionsAsync()) {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
        })

        if (!result.cancelled) {
            return result
        }
    }
}

export async function takePictureAsync() {
    if (await ImagePicker.requestCameraPermissionsAsync()) {
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
        })

        if (!result.cancelled) {
            return result
        }
    }
}

export default {
    pickImageAsync,
    takePictureAsync
}