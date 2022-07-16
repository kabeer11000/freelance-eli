//@ts-no-check
import {useContext} from "react";
import {AuthContext} from "../../Contexts";
import {useLinkTo} from "@react-navigation/native";

const AuthContextRoute = () => {
    const {Auth} = useContext(AuthContext);
    const linkTo = useLinkTo();
    if (Auth?.savedCredentials === false) linkTo("/Login");
    return <React.Fragment/>
}