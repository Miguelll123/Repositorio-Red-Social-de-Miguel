
import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import commentService from "./commentService";

const initialState = {
    commentsByPost:{},
    isLoading:false,
    error:null
};

export const getCommentsByPost = createAsyncThunk("comments/getCommentsByPost",async(postId)=>{
     try {
     return await commentService.getCommentsByPost(postId);
     } catch(error){
        console.error(error)
     }
});


export const createComment = createAsyncThunk("comments/createComment",async({postId,comment},thunkAPI)=>{
    try {

   const token = thunkAPI.getState().auth.token;
   return await commentService.createComment(postId,comment,token);    
    } catch(error){
        if(error.response && error.response.status === 400) {
         return thunkAPI.rejectWithValue(error.response.data);
        }
        console.error(error)
        return thunkAPI.rejectWithValue(error.message || 'Error al crear el comment');
    }
});

export const commentSlice = createSlice({
    name:'comments',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(getCommentsByPost.fulfilled,(state,action)=>{
            state.commentsByPost[action.meta.arg] = action.payload;
            state.isLoading = false;
        })
        .addCase(getCommentsByPost.pending,(state)=>{
            state.isLoading= true;
        })
        .addCase(createComment.fulfilled,(state,action)=>{
            const postId = action.meta.arg.postId;
            if (!state.commentsByPost[postId]) {
                state.commentsByPost[postId] = [];
            }
            state.commentsByPost[postId].push(action.payload);
            state.isLoading= false;
        })
        .addCase(createComment.pending,(state)=>{
            state.isLoading= true
        })
    }
})


export default commentSlice.reducer;