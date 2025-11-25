import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import authService from './auth/authService';

const user = JSON.parse(localStorage.getItem("user"))|| null;
const token = localStorage.getItem("token")|| null;

const initialState = {
    user:user,
    token:token,
};


export const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(login.fulfilled,(state,action)=>{
            if(action.payload){
                state.user = action.payload.user;
                state.token = action.payload.token;
            }
        })
        .addCase(login.rejected,(state,action)=>{
            state.user = null;
            state.token = null;
        })
    
       .addCase(logout.fulfilled,(state)=>{
        state.user=null;
        state.token='';

       })
    }
});


export const register = createAsyncThunk('auth/register',
    async(user)=>{
    try {
   return await authService.register(user);
    } catch(error){
        console.error(error)
    }
});

export const login = createAsyncThunk('auth/login',
    async(user)=>{
        try {
       return await authService.login(user)

        } catch(error){
            console.error(error)
        }
    }
);
export const logout = createAsyncThunk('auth/logout',
    async()=>{
        try {
       return await authService.logout();
        } catch(error){
            console.error(error)
        }
    }
)






export default authSlice.reducer;