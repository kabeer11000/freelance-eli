const Base = "https://bull36.com"
const serializeObject = (o: Object) => new URLSearchParams(o).toString();
export default {
    Base: Base,
    UploadImageTest: () => "http://192.168.10.5:3000/images/upload",
    Login: (a: { username: string, password: string, ip?: string | number, lang?: string, version?: string | number }) => `https://bull36.com/app/login?username=${a.username}&password=${a.password}&lang=he&ip=123&version=0.1`,
    GetChats: (a: { token: string, lang?: string, ip?: string, page?: string, version?: string }) => `https://bull36.com/app/get_chats?token=${a.token}&lang=he&ip=123&version=0.1&page=${a.page ? "1" : a.page}`,
    GetChat: (a: { token: string, lang?: string, id: string | number, ip?: string, version?: string }) => `https://bull36.com/app/get_chat?token=${a.token}&lang=he&ip=123&version=0.1&id=${a.id}`,
    ReadMessage: (a: { token: string, lang?: string, id: string, ip?: string, version?: string }) => `http://192.168.10.5:3000/static/read-message.json`,
    SendMessage: (a: { token: string, lang?: string, version?: string, mission_id: string | number, owner: string | number, contactus_id: string | number, cust_chat_id: string | number, ip?: string, _id?: string | number | any, project_id: string | number, recipient_id: string, clientpro_cust_id: string | number, invoice_id: string | number, csv_id: string | number, message: string }) => `https://bull36.com/app/add_chat?token=${a.token}&lang=he&ip=123&version=0.1&mission_id=${a.mission_id}&project_id=${a.project_id}&owner=${a.owner}&contactus_id=${a.contactus_id}&cust_chat_id=${a.cust_chat_id}&clientpro_cust_id=${a.clientpro_cust_id}&invoice_id=${a.invoice_id}&csv_id=${a.csv_id}&message=${a.message}&recipient_id=${a.recipient_id}&_id=${a._id}&uploadedFile=files`,
    _sendMessage: `https://bull36.com/app/add_chat`,
    EditMessage: (a: { token: string, ip?: string, version?: string, message: string, time: string, _id: string }) => `https://bull36.com/app/edit_chat?token=${a.token}&lang=he&ip=${a.ip ?? (123).toString()}&version=${a.version ?? (0.1).toString()}&message=${a.message}&time=${a.time}&_id=${a._id}`,
    DeleteMessage: (a: { token: string, ip?: string, version?: string, time: string, _id: string }) => `https://bull36.com/app/delete_message?token=${a.token}&lang=he&ip=${a.ip ?? (123).toString()}&version=${a.version ?? (123).toString()}&_id=${a._id}&time=${a.time}`
}
