import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import authService from './auth/authService';
import { message } from 'antd';

const user = JSON.parse(localStorage.getItem("user"))|| null;
const token = localStorage.getItem("token")|| null;

const initialState = {
    user:user,
    token:token,
    isError:false,
    isSucces:false,
    message:"",
};


export const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        reset:(state)=>{
       state.isError=false,
       state.isSucces=false,
       state.message= ""
        }
    },
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
       .addCase(register.fulfilled,(state,action)=>{
            if(action.payload){
                state.isSucces=true;
                state.message=action.payload.msg || action.payload.message || 'Registro exitoso';
            }
       })
       .addCase(register.rejected,(state,action)=>{
        state.isError=true;
        state.message=action.payload
       })
       .addCase(getUserProfile.fulfilled,(state,action)=>{
        if(action.payload){
            state.user = action.payload.user;
        }
       })
       .addCase(toggleFollow.fulfilled,(state,action)=>{
        // Después de seguir/dejar de seguir, recargar el perfil
        // O actualizar manualmente los followers/following
       })
    }
});
export const {reset} = authSlice.actions

export const register = createAsyncThunk('auth/register',
    async(user)=>{
    try {
   return await authService.register(user);
    } catch(error){
        const message = error.response.data.error[0].message;
        return thunkAPI.rejectwithVAlue(message)
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
);

export const getUserProfile = createAsyncThunk('auth/getUserProfile',
    async(_, thunkAPI)=>{
        try {
            return await authService.getUserProfile();
        } catch(error) {
            console.error(error);
            throw error;
        }
    }
);

export const toggleFollow = createAsyncThunk('auth/toggleFollow',
    async(userId, thunkAPI)=> {
        try {
            return await authService.toggleFollow(userId);
        } catch(error){
            console.error(error);
            throw error;
        }
    }
);






export default authSlice.reducer;