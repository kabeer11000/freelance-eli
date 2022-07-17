

export type LoginFunction = (a: ILoginFunctionInterface) => Promise<void>
export interface IChat {
    "_id"?: {
        "$oid": string
    },
    "id": string | number,
    "contactus_id": number,
    "owner": number,
    "project_id": number,
    "mission_id": number,
    "cust_chat_id": number,
    "clientpro_cust_id": number,
    "invoice_id": number,
    "users": object,
    "messages": Array<{
        "type": string,
        "time": string,
        "message": string,
        "direction": string,
        "file_url"?: string
    }>,
    "last_update": string,
    "csv_id": number
}


export interface ILoginFunctionInterface {
    username: string,
    password: string,
    rememberMe?: boolean
}

export interface IAuthContextObject {
    "id": string,
    "user_name": string,
    "profile_image": string,
    "token": string,
    "two_auth": string,
    "assigned_manager": string,
    "organization_id": string,
    "team_members": Array<{
        "id": string,
        "user_name": string,
        "name": string,
        "profile_image": string
    }>,
    "app_lang": string,
    "status": boolean
}
