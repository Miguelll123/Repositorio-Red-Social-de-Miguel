import React from 'react'
import { useSelector } from 'react-redux'
import { Card,Avatar } from 'antd';
import {UserOutlined} from '@ant-design/icons';
import '../Post.css';

const API_URL = 'http://localhost:8080';

export const Post = () => {

const {posts} = useSelector((state)=>state.posts);
const {user} = useSelector((state)=>state.auth);


if (!posts || posts.length === 0) {
    return <div>No hay posts</div>;
}
// Construir la URL completa de la imagen
const postElements = posts.map((post)=>{
   // Función para convertir URLs de imgur.com a i.imgur.com (URLs directas)
   const convertImgurUrl = (url) => {
     if (!url) return null;
     // Si es una URL de imgur.com (página), convertirla a i.imgur.com (imagen directa)
     if (url.includes('imgur.com') && !url.includes('i.imgur.com')) {
       const imgurId = url.split('/').pop();
       return `https://i.imgur.com/${imgurId}.jpg`;
     }
     return url;
   };
   
   // Si la imagen del autor ya es una URL completa, convertirla si es necesario
   // Si no, construir la URL con el backend
   const authorImageUrl = post.author?.image 
     ? (post.author.image.startsWith('http') 
         ? convertImgurUrl(post.author.image)
         : `${API_URL}/${post.author.image}`)
     : null;

   // Si la imagen del post ya es una URL completa (de seeders), usarla directamente
   // Si no, construir la URL con el backend
   const postImageUrl = post.image 
     ? (post.image.startsWith('http') 
         ? post.image 
         : `${API_URL}/${post.image}`)
     : null;

   return (
    <Card
    className='posts' key={post._id} >
    <div className='header posts'>
     {authorImageUrl ?  (
      <Avatar src={authorImageUrl} /> ) : (
      <Avatar icon={<UserOutlined/>} />
     )} 
    {post.author?.username}
    </div>

    <h3>{post.title}</h3>
      <p>{post.content}</p>

     {postImageUrl && (
      <img src={postImageUrl} alt={post.title}/>
     )}
    </Card>
   )
});
return <div>{postElements}</div>;
};

export default Post
