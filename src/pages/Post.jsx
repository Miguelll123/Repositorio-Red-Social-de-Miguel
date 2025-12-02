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
      <React.Fragment key={post._id}>
        <Card 
          className="posts" 
          key={post._id}
          onClick={(e) => {
            // Prevenir que el Card capture el click
            if (e.target.closest('button')) {
              return;
            }
          }}
        >
          <div className="header posts">
            {authorImageUrl ? (
              <Avatar src={authorImageUrl} />
            ) : (
              <Avatar icon={<UserOutlined />} />
            )}
            {post.author?.username}
          </div>

          <h3>{post.title}</h3>
          <p>{post.content}</p>

          {postImageUrl && <img src={postImageUrl} alt={post.title} />}

          <div
            style={{
              display: 'flex',
              gap: '16px',
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: '1px solid #f0f0f0',
              fontSize: '14px',
              color: '#666',
            }}
          >
            <span>
              <LikeOutlined style={{ marginRight: '4px' }} />
              {post.likes?.length || 0}
            </span>
            <div
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🟢 Click detectado en div de comentarios, postId:', post._id);
                handleToggleComments(post._id);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleToggleComments(post._id);
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                userSelect: 'none',
                position: 'relative',
                zIndex: 10,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <CommentOutlined style={{ marginRight: '4px' }} />
              {post.comments?.length || 0}
            </div>
          </div>
        </Card>

        <Modal
          title={
            <span style={{ color: 'var(--text-primary)' }}>
              Comentarios ({commentsByPost[post._id]?.length || 0})
            </span>
          }
          open={openCommentsPostId === post._id}
          onCancel={() => {
            console.log('Cerrando modal');
            handleToggleComments(post._id);
          }}
          footer={null}
          width={600}
          getContainer={false}
          styles={{
            content: {
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--border-radius-lg)',
            },
            header: {
              backgroundColor: 'var(--bg-secondary)',
              borderBottom: '1px solid var(--border-color)',
            },
            body: {
              backgroundColor: 'var(--bg-secondary)',
            },
          }}
        >
          <div
            style={{
              maxHeight: '400px',
              overflow: 'auto',
              marginBottom: 'var(--spacing-xs)',
              paddingRight: 'var(--spacing-xs)',
            }}
          >
            {LoadingComments ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: 'var(--spacing-lg)',
                  color: 'var(--text-secondary)',
                }}
              >
                Cargando comentarios...
              </div>
            ) : commentsByPost[post._id]?.length > 0 ? (
              commentsByPost[post._id].map((comment) => {
                const commentAuthorImage = comment.author?.image
                  ? comment.author.image.startsWith('http')
                    ? convertImgurUrl(comment.author.image)
                    : `${API_URL}/${comment.author.image}`
                  : null;

                return (
                  <div
                    key={comment._id}
                    style={{
                      display: 'flex',
                      gap: 'var(--spacing-md)',
                      marginBottom: 'var(--spacing-md)',
                      paddingBottom: 'var(--spacing-md)',
                      borderBottom: '1px solid var(--border-color)',
                    }}
                  >
                    <Avatar
                      src={commentAuthorImage}
                      icon={<UserOutlined />}
                      size="small"
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontWeight: 'var(--font-weight-semibold)',
                          marginBottom: 'var(--spacing-xs)',
                          color: 'var(--text-primary)',
                          fontSize: 'var(--font-size-sm)',
                        }}
                      >
                        {comment.author?.username}
                      </div>
                      <div
                        style={{
                          color: 'var(--text-secondary)',
                          fontSize: 'var(--font-size-sm)',
                          lineHeight: 'var(--line-height-normal)',
                        }}
                      >
                        {comment.comment}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  padding: 'var(--spacing-lg)',
                  color: 'var(--text-tertiary)',
                }}
              >
                No hay comentarios aún. ¡Sé el primero en comentar!
              </div>
            )}
          </div>

          {user && (
            <div
              style={{
                display: 'flex',
                gap: 'var(--spacing-sm)',
                paddingTop: 'var(--spacing-md)',
                borderTop: '1px solid var(--border-color)',
              }}
            >
              <Input
                name={`comment-${post._id}`}
                id={`comment-input-${post._id}`}
                placeholder="Escribe un comentario"
                value={newComment[post._id] || ''}
                onChange={(e) =>
                  setNewComment((prev) => ({
                    ...prev,
                    [post._id]: e.target.value,
                  }))
                }
                onPressEnter={() => handleCreateComment(post._id)}
                style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                  borderRadius: 'var(--border-radius-md)',
                }}
              />
              <Button
                type="primary"
                onClick={() => handleCreateComment(post._id)}
                style={{
                  backgroundColor: 'var(--color-primary)',
                  borderColor: 'var(--color-primary)',
                  borderRadius: 'var(--border-radius-md)',
                }}
              >
                Publicar
              </Button>
            </div>
          )}
        </Modal>
      </React.Fragment>
    );
  });

  return <div>{postElements}</div>;
};

export default Post;
