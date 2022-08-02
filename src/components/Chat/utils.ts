export const ResolveUsers = (Auth, ids) => {
    return ids.map(_ => Auth.team_members.find(({id}: { id: string }) => id === _) || (_ === Auth.id ? ({
            id: Auth.id,
            profile_image: Auth.profile_image,
            name: Auth.user_name
        }) : null)
    ).filter(a => a)
}

let c = {};
export const consoleCount = (arg) => {
    c[arg] = c[arg] ? (c[arg] + 1) : 0;
    console.log(c[arg], arg)
}
