import userApi from "./axios"
import { endpoints } from "./endpoints"

export const fetchUserList = async ()=>{
    const res = await userApi.get(endpoints.register)
    return res.data
}


export const fetchChatMessages = async (current, other) => {
    const res = await userApi.get(endpoints.chatlist,{
        params:{
            current:current,
            other: other
        }
    })
    return res.data
}