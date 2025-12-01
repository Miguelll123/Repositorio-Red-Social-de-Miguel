import {configureStore} from '@reduxjs/toolkit'
import auth from '../features/authSlice'
import posts from '../features/posts/postSlice'
import comment from '../features/comments/commentSlice.jsx'


export const store = configureStore({
    reducer:{
        auth,
        posts,
        comment
    },
});