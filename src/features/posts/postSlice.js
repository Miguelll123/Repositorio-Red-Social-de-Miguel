import {createAsyncThunk,createSlice} from '@reduxjs/toolkit';
import postService from './postService';

const initialState = {
    posts:[],
    isLoading:false
};

// ✅ PRIMERO definimos el thunk
export const getALl = createAsyncThunk("posts/getAll",async()=>{
    try {
     return await postService.getALl();
    } catch(error) {
        console.error(error)
    }
});

export const searchByTitle = createAsyncThunk("posts/searchByTitle",async(title)=>{
    try {
   return await postService.searchByTitle(title);

    } catch(error){
        console.error(error)
    }
})

// ✅ DESPUÉS el slice que lo usa
export const postSlice = createSlice({
    name:'posts',
    initialState,
    reducers:{
        reset:(state)=>{
            state.isLoading=false;
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(getALl.fulfilled,(state,action)=>{
            state.posts=action.payload.posts;
            state.isLoading=false;
        })
        .addCase(getALl.pending,(state)=>{
        state.isLoading=true;
        })
        .addCase(searchByTitle.fulfilled,(state,action)=>{
            state.posts=action.payload;
            state.isLoading=false;
        })
        .addCase(searchByTitle.pending,(state)=>{
            state.isLoading=true;
        })
    }
})

// ✅ Exportar el reducer por defecto
export default postSlice.reducer;
export const {reset} = postSlice.actions;