import {createAsyncThunk,createSlice} from '@reduxjs/toolkit';
import postService from './postService';

const initialState = {
    posts:[],
    isLoading:false
};

// ✅ PRIMERO definimos el thunk
export const getALl = createAsyncThunk("posts/getAll",async()=>{
    try {
     return await postService.getAll();
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
});
export const like = createAsyncThunk("posts/like",async(_id, thunkAPI)=>{
    try {
        const token = thunkAPI.getState().auth.token; // Obtener el token del estado de auth
        return await postService.like(_id, token);
    } catch(error){
        // Si el error es 400 (ya dio like), devolver el error para que el reducer lo maneje
        if (error.response && error.response.status === 400) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
        console.error(error);
        return thunkAPI.rejectWithValue(error.message || 'Error al dar like');
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
        .addCase(like.fulfilled,(state,action)=>{
            // El backend devuelve { message, post }
            if (action.payload && action.payload.post) {
                const updatedPost = action.payload.post;
                const index = state.posts.findIndex(post => post._id === updatedPost._id);
                if (index !== -1) {
                    // Actualizar el post completo con los datos actualizados
                    state.posts[index] = updatedPost;
                }
            }
            state.isLoading = false;
        })
        .addCase(like.pending,(state)=>{
            state.isLoading = true;
        })
        .addCase(like.rejected,(state,action)=>{
            // Si el usuario ya dio like, mostrar el error pero no cambiar el estado
            state.isLoading = false;
            console.error('Error al dar like:', action.error);
        })
        
    }
})

// ✅ Exportar el reducer por defecto
export default postSlice.reducer;
export const {reset} = postSlice.actions;