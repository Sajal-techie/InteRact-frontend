import userApi from "./axios";
import { endpoints } from "./endpoints";


export const registerService = async (userData) =>{
    console.log(userData, ' in auth service register');
    try{
        const response = await userApi.post(endpoints.register,userData)
        console.log(response, ' response of register');
        return response.data
    }catch(error){
        console.log(error, 'error in login');
        throw Object.values(error.data)[0]
    }
}

export const loginService = async (userData) => {
    try{
        console.log(userData, 'in login auth servie');

        const res = await userApi.post(endpoints.login, userData)
        console.log(res, 'login responce');

        return res.data
    }catch(error){
        console.log(error, 'error in login');
        throw error.data
    }
}


export const logoutService = async() => {
    try{
        const response = await userApi.post(endpoints.logout)
        console.log(response, 'response in logout service');
        localStorage.clear()
        return response.data
    }catch(error){
        console.log(error, "error in logout");
        
    }
} 