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
            }: { username: string, password: string, ip: string | number, lang: string, version: string | number }) => `http://192.168.10.6:3000/static/login.json`,
    GetChats: (a: { token: string, lang?: string, ip?: string, version?: string }) => `http://192.168.10.6:3000/static/get-chats.json`
}
