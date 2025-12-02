import { useSelector } from "react-redux";
import { Card, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const API_URL = 'http://localhost:8080';

// Función para convertir URLs de imgur.com a i.imgur.com
const convertImgurUrl = (url) => {
  if (!url) return null;
  if (url.includes('imgur.com') && !url.includes('i.imgur.com')) {
    const imgurId = url.split('/').pop();
    return `https://i.imgur.com/${imgurId}.jpg`;
  }
  return url;
};

export default function Profile() {
  const {user} = useSelector((state)=>state.auth);
  const {posts} = useSelector((state)=>state.posts);
 
  // Imagen del Usuario (avatar del perfil)
  const imageUrl = user?.image 
    ? (user.image.startsWith('http')
        ? convertImgurUrl(user.image)
        : `${API_URL}/${user.image}`)
    : null;

  // Filtrar los posts del usuario
  const userPosts = posts.filter((post) => {
    if (!post.author || !user) return false;
    return String(post.author._id) === String(user._id);
  });

  // Mapear los posts para mostrarlos
  const postElements = userPosts.map((post) => {
    // Imagen del post (la foto que subió con el post)
    const postImageUrl = post.image 
      ? (post.image.startsWith('http') 
          ? post.image 
          : `${API_URL}/${post.image}`)
      : null;

    return (
      <Card key={post._id} className='posts' style={{ marginBottom: '16px',height:'700px',justifyContent:'center',alignContent:'center' }}>
        <h3>{post.title}</h3>
        <p>{post.content}</p>
        {postImageUrl && (
          <img 
            src={postImageUrl} 
            alt={post.title}
            style={{ width: '100%', maxWidth: '500px', borderRadius: '8px', marginTop: '12px' }}
          />
        )}
      </Card>
    );
  });

  return (
    <div>
      <h1>Profile</h1>
      <p>{user?.username}</p>
      <p>{user?.email}</p>
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={`${user?.username} avatar`}
          style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '50%' }}
        />
      ) : (
        <p>No hay imagen de perfil</p>
      )}
      
      
      {userPosts.length > 0 ? (
        <div>{postElements}</div>
      ) : (
        <p>Todavia no tiene publicaciones</p>
      )}
    </div>
  );
}

