import {configureStore} from '@reduxjs/toolkit'
import auth from '../features/authSlice'
import posts from '../features/posts/postSlice'


export const store = configureStore({
    reducer:{
        auth,
        posts
    },
});