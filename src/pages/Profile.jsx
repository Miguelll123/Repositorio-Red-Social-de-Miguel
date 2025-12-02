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
      <Card key={post._id} className='posts' style={{ marginBottom: '16px' }}>
        <div className='header posts'>
          {imageUrl ? (
            <Avatar src={imageUrl} />
          ) : (
            <Avatar icon={<UserOutlined/>} />
          )}
          {user?.username}
        </div> 
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
  <div className="Profile-container" style={{maxWidth:'800px',margin:'0 auto',padding:'40px 0'}}>
    
    {/* CABECERA DEL PERFIL: avatar + datos */}
    <div className="Profile-header" style={{display:'flex',alignItems:'center',gap:'20px', marginBottom:'30px',justifyContent:'center'}}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`${user?.username} avatar`}
          className="Profile-avatar"
          style={{
            width:'220px',
            height:'220px',
            borderRadius:'50%',
            objectFit:'cover',
            border: '3px solid #40a9ff'
        
            
          }}
        />
      ) : (
        <p>No hay imagen de perfil</p>
      )}

      <div className="Profile-info" style={{gap:'20px',color:'#0d6efd'}}>
        <h2 style={{padding:'20px'}}>{user?.username}</h2>
        <p style={{color:'#40a9ff'}}>{user?.email}</p>
      </div>
    </div>

    {/* POSTS DEL USUARIO */}
    <div className="Profile-posts" style={{display:'flex',flexDirection:'column',gap:'20px',height:'200px', width:'300px'}}>
      {userPosts.length > 0 ? (
        <div>{postElements}</div>
      ) : (
        <p>Todavía no tiene publicaciones</p>
      )}
    </div>

  </div>
);


}
/*
  return (
    
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
      
    }}>
    
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

*/