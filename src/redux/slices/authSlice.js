import { createSlice } from "@reduxjs/toolkit";
import { LoginThunk, SignupThunk, LogoutThunk } from "../thunks/authThunk";


const initialState = {
    user: localStorage.getItem("user", null),
    userId: localStorage.getItem("userId", null),
    loading: false,
    error: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{

    },
    extraReducers: (builder) => {
        builder.addCase(SignupThunk.pending, (state) => {
            state.loading = true
        })
        .addCase(SignupThunk.fulfilled, (state, action) => {
            console.log(state, action, 'infullfilled');
            state.loading = false
            state.user = action.payload.user
            state.error = null
            state.user_id = action.payload.user_id
        })
        .addCase(SignupThunk.rejected, (state, action) => {
            console.log("signoup rejected", action);
            state.loading = false
            state.error = action.payload
        })
        .addCase(LoginThunk.pending, (state)=>{
            state.loading = true
        })
        .addCase(LoginThunk.fulfilled, (state,action) => {
            console.log("in login fullfilled", action, state);
            state.user = action.payload.user
            state.userId = action.payload.user_id
            state.loading = false
            state.error = null
        })
        .addCase(LoginThunk.rejected, (state,action)=>{
            console.log('in login rejected');
            state.loading = false
            state.error = action.payload
        })
        
    }
})


export default authSlice.reducer