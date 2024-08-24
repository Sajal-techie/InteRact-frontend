import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginService, logoutService, registerService } from "../../services/authServices";



export const LoginThunk = createAsyncThunk(
    "auth/Login",
    async (data, {rejectWithValue}) => {
        console.log(data, 'data on login thunk');
        
        try{
            const res = await loginService(data)
            console.log(res, 'response in thunk');
            localStorage.setItem("access", res.access);
            localStorage.setItem("refresh", res.refresh);
            localStorage.setItem("userId", res.user_id);
            localStorage.setItem("user", res.user);
            return res
            
        } catch(error){
            console.log(error, "error in login thunk");
            return rejectWithValue(error)
        }
    }
)


export const SignupThunk = createAsyncThunk(
    "auth/Signup",
    async (data, {rejectWithValue}) => {
        try{
            await registerService(data)
            const response = await loginService(data)
            console.log(response, 'response in thunk')
            localStorage.setItem("access", response.access);
            localStorage.setItem("refresh", response.refresh);
            localStorage.setItem("user", response.user);
            localStorage.setItem("userId", response.user_id);
            return response
        }catch(error){
            console.log(error, "error in signup thunk");
            return rejectWithValue(error)
        }
    }
)

export const LogoutThunk = createAsyncThunk(
    "auth/Logout", async () => {
        try{
            const response = await logoutService()
            console.log(response, 'response in thunk');
            
        }catch(error){
            console.log(error, "error in logout");
            
        }
    }
)