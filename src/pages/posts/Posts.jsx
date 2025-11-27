import React, { useEffect } from 'react';
import Post from './Post';
import {useDispatch,useSelector} from 'react-redux';
import { getALl,reset } from '../../features/posts/postSlice';


export const Posts = () => {

  const {isLoading}= useSelector((state)=>state.posts)
const dispatch = useDispatch();


useEffect(()=>{
  dispatch(getALl())
},[])
  
if(isLoading){
  return <h1>Cargando Posts...</h1>
}
  return (
    <div>Posts
    <Post/>
    </div>
  )
}


export default Posts
