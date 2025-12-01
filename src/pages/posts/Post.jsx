import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Card,Avatar, notification } from 'antd';
import {UserOutlined, LikeOutlined, CommentOutlined} from '@ant-design/icons';
import { like } from '../../features/posts/postSlice';
import '../Post.css';

const API_URL = 'http://localhost:8080';

export const Post = () => {

const {posts} = useSelector((state)=>state.posts);
const {user} = useSelector((state)=>state.auth);
const dispatch = useDispatch();


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

   // Verificar si el usuario ya dio like a este post
   const hasUserLiked = user && post.likes?.some(likeUser => {
     // Puede ser un objeto con _id o directamente el _id
     const likeUserId = typeof likeUser === 'object' ? likeUser._id : likeUser;
     return likeUserId === user._id || likeUserId === user.id;
   });

   // Handler para cuando se hace clic en el like
   const handleLikeClick = async () => {
     if (user && !hasUserLiked) {
       try {
         await dispatch(like(post._id)).unwrap();
       } catch (error) {
         // Si el error es que ya dio like, mostrar notificación
         if (error?.message?.includes('Ya has dado like')) {
           notification.warning({
             message: 'Like duplicado',
             description: 'Ya has dado like a este post.',
           });
         }
       }
     } else if (hasUserLiked) {
       notification.info({
         message: 'Ya has dado like',
         description: 'Solo puedes dar like una vez a cada post.',
       });
     }
   };

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
     
     {/* Iconos de likes y comentarios */}
     <div style={{ 
       display: 'flex', 
       gap: '16px', 
       marginTop: '12px', 
       paddingTop: '12px', 
       borderTop: '1px solid #f0f0f0',
       fontSize: '14px',
       color: '#666'
     }}>
       <span 
         onClick={handleLikeClick}
         style={{ 
           display: 'flex', 
           alignItems: 'center', 
           cursor: (user && !hasUserLiked) ? 'pointer' : 'not-allowed',
           opacity: (user && !hasUserLiked) ? 1 : 0.5,
           color: hasUserLiked ? '#1890ff' : '#666'
         }}
         title={hasUserLiked ? 'Ya has dado like a este post' : user ? 'Dar like' : 'Inicia sesión para dar like'}
       >
         <LikeOutlined style={{ marginRight: '4px' }} />
         {post.likes?.length || 0}
       </span>
       <span style={{ display: 'flex', alignItems: 'center' }}>
         <CommentOutlined style={{ marginRight: '4px' }} />
         {post.comments?.length || 0}
       </span>
     </div>
    </Card>
   )
});
return <div>{postElements}</div>;
};

export default Post
