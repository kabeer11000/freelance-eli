const Base = "https://bull36.com"
//http://192.168.10.5:3000/static/login.json
//@ts-ignore
const serializeObject = (o: Object) => new URLSearchParams(o).toString();

export default {
    Base: Base,
    UploadImageTest: () => "http://192.168.10.5:3000/images/upload",
    Login: ({
                username,
                password,
                ip,
                lang,
                version
            }: { username: string, password: string, ip: string | number, lang: string, version: string | number }) => `https://pastebin.com/raw/Gig6ZHGd`,
    GetChats: (a: { token: string, lang?: string, ip?: string, version?: string }) => `https://pastebin.com/raw/fANy6bKZ`,
    GetChat: (a: { token: string, lang?: string, id: string | number, ip?: string, version?: string }) => `https://pastebin.com/raw/HkkukZaH`,
    ReadMessage: (a: { token: string, lang?: string, id: string, ip?: string, version?: string }) => `http://192.168.10.5:3000/static/read-message.json`,
    SendMessage: (a: { token: string, lang?: string, version?: string, mission_id: string | number, owner: string | number, contactus_id: string | number, cust_chat_id: string | number, ip?: string, clientpro_cust_id: string | number, invoice_id: string | number, csv_id: string | number, message: string }) => `http://192.168.10.5:3000/static/read-message.json`,
    //https://bull36.com/app/add_chat?token=GC8RUZ98QWERT&lang=he&ip=123&version=0.1&mission_id=12&project_id=21&owner=80&contactus_id=57&cust_chat_id=2115717&clientpro_cust_id=4322571&invoice_id=6789021&csv_id=751&message=test&recipient_id=12&_id=12&uploadedFile=files
}
