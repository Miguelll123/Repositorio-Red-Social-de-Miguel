import React, { useReducer, useState } from 'react'
import { useSelector } from 'react-redux'
import { Card,Avatar } from 'antd';
import {UserOutlined,LikeOutlined,CommentOutlined} from '@ant-design/icons';
import './Post.css';
import { createComment, getCommentsByPost } from '../features/comments/commentSlice';
import { notification } from 'antd';

const API_URL = 'http://localhost:8080';

export const Post = () => {

  const [openCommentsPostId,setOpenCommentsPostId] = useState(null);
  const [newComment,setNewComment] = useState("");

  // Obtener datos de Redux
  const commentsByPost = useSelector((state)=>state.comments.commentsByPost);
  const LoadingComments = useSelector((state)=>state.comments.isLoading);

  const {posts} = useSelector((state)=>state.posts);
  const {user} = useSelector((state)=>state.auth);


  if (!posts || posts.length === 0) {
      return <div>No hay posts</div>;
  }

  // Construir la URL completa de la imagen
  const postElements = posts.map((post)=>{

    const convertImgurUrl = (url) => {
      if (!url) return null;
      if (url.includes('imgur.com') && !url.includes('i.imgur.com')) {
        const imgurId = url.split('/').pop();
        return `https://i.imgur.com/${imgurId}.jpg`;
      }
      return url;
    };
    
    const authorImageUrl = post.author?.image 
      ? (post.author.image.startsWith('http') 
          ? convertImgurUrl(post.author.image)
          : `${API_URL}/${post.author.image}`)
      : null;

    const postImageUrl = post.image 
      ? (post.image.startsWith('http') 
          ? post.image 
          : `${API_URL}/${post.image}`)
      : null;

    const handleToggleComments = (postId)=> {
      if(openCommentsPostId === postId){
        setOpenCommentsPostId(null);
      } else {
        setOpenCommentsPostId(postId);

        if(!setOpenCommentsPostId){
          dispatch(getCommentsByPost(postId));
        }
      }
    };

    const handleCreateComment = async(postId)=> {
      if(!newComment.trim()) return;

      try {
        await dispatch(createComment(postId, newComment.trim())).unwrap();
        setNewComment("");
      } catch(error){
        notification.error({
          description:{
            message:"Hay un error"
          }
        });
      }
    };

    // --- AQUÍ FALTABA EL RETURN ---
    return (
      <Card
        className='posts'
        key={post._id}
      >
        <div className='header posts'>
          {authorImageUrl ? (
            <Avatar src={authorImageUrl} />
          ) : (
            <Avatar icon={<UserOutlined/>} />
          )}
          {post.author?.username}
        </div>

        <h3>{post.title}</h3>
        <p>{post.content}</p>

        {postImageUrl && (
          <img src={postImageUrl} alt={post.title}/>
        )}

        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          marginTop: '12px', 
          paddingTop: '12px', 
          borderTop: '1px solid #f0f0f0',
          fontSize: '14px',
          color: '#666'
        }}>
          <span>
            <LikeOutlined style={{ marginRight: '4px' }} />
            {post.likes?.length || 0}
          </span>
          <span>
            <CommentOutlined style={{ marginRight: '4px' }} />
            {post.comments?.length || 0}
          </span>
        </div>
      </Card>
    );  
  });

  return <div>{postElements}</div>;
};

export default Post;
