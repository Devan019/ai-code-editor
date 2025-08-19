import { google } from "googleapis";

export const getClient = ({access_token} : {access_token : string}) => {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({access_token})
    return auth;
}