import {Dimensions} from "react-native";

const heightMobileUI = 896;
const widthMobileUI = 414;
export const responsiveWidth = width => {
    return (Dimensions.get('window').width * width) / widthMobileUI;
};

export const responsiveHeight = height => {
    return (Dimensions.get('window').height * height) / heightMobileUI;
};
export const getSubset = (obj, keys: Array<string>) => {
    const objectKeys = Object.keys(obj);
    const values = Object.values(obj);
    const r = {};
    for (const [key, index] of objectKeys.entries()) {
        if (keys.includes(key)) r[key] = values[index]
    }
    return r;
}
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

export function toFormData(o) {
    // @ts-ignore
    return Object.entries(o).reduce((d, e) => (d.append(...e), d), new FormData())
}
