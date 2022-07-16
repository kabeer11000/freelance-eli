const Base = "https://bull36.com"
//@ts-ignore
const serializeObject = (o: Object) => new URLSearchParams(o).toString();

export default {
    Base: Base,
    Login: ({
                username,
                password,
                ip,
                lang,
                version
            }: { username: string, password: string, ip: string | number, lang: string, version: string | number }) => `${Base}/app/login?username=${username}&password=${password}&lang=${lang}&ip=${ip}&version=${version}`,
    GetChats: (a: {token: string, lang?: string, ip?: string, version?: string}) => `${Base}/app/get_chats?${serializeObject(a)}`
}
