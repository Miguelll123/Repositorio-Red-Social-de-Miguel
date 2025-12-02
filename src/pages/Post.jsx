import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Avatar, notification, Modal, Input, Button, Space } from 'antd';
import { UserOutlined, LikeOutlined, CommentOutlined } from '@ant-design/icons';
import './Post.css';
import { getCommentsByPost, createComment } from '../features/comments/commentSlice';

const API_URL = 'http://localhost:8080';

export const Post = () => {
  const dispatch = useDispatch();

  const [openCommentsPostId, setOpenCommentsPostId] = useState(null);
  const [newComment, setNewComment] = useState({});

  // Obtener datos de Redux
  const commentsByPost = useSelector((state) => state.comment.commentsByPost);
  const LoadingComments = useSelector((state) => state.comment.isLoading);

  const { posts } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);

  // Funciones fuera del map
  const handleToggleComments = (postId) => {
    console.log('🔵 Click en comentarios, postId:', postId);
    console.log('🔵 openCommentsPostId actual:', openCommentsPostId);
    if (openCommentsPostId === postId) {
      setOpenCommentsPostId(null);
    } else {
      setOpenCommentsPostId(postId);
      console.log('🔵 Abriendo modal para postId:', postId);

      if (!commentsByPost[postId]) {
        dispatch(getCommentsByPost(postId));
      }
    }
  };

  const handleCreateComment = async (postId) => {
    const commentText = newComment[postId]?.trim();
    if (!commentText) return;

    try {
      await dispatch(createComment({ postId, comment: commentText })).unwrap();
      setNewComment((prev) => ({ ...prev, [postId]: '' }));
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'No se pudo publicar el comentario',
      });
    }
  };

  // Función helper para convertir URLs de Imgur
  const convertImgurUrl = (url) => {
    if (!url) return null;
    if (url.includes('imgur.com') && !url.includes('i.imgur.com')) {
      const imgurId = url.split('/').pop();
      return `https://i.imgur.com/${imgurId}.jpg`;
    }
    return url;
  };

  if (!posts || posts.length === 0) {
    return <div>No hay posts</div>;
  }

  const postElements = posts.map((post) => {
    const authorImageUrl = post.author?.image
      ? post.author.image.startsWith('http')
        ? convertImgurUrl(post.author.image)
        : `${API_URL}/${post.author.image}`
      : null;

    const postImageUrl = post.image
      ? post.image.startsWith('http')
        ? post.image
        : `${API_URL}/${post.image}`
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

export default Post;
