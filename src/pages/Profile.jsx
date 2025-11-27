import { useSelector } from "react-redux";

const API_URL = 'http://localhost:8080';

export default function Profile() {
  const {user} = useSelector((state)=>state.auth);
  const {posts} = useSelector((state)=>state.posts);
  // Construir la URL completa de la imagen
  const imageUrl = user?.image 
    ? `${API_URL}/${user.image}` 
    : null;

  const postImageAuthor = posts.author?.image ?
  `${API_URL}/${posts.author.image}` : null;

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
      {postImageAuthor ? (
        <img 
        src={postImageAuthor}
        alt={posts?.author.image}
        style={{width: '200px', height: '200px'}} 
        />
      ):(
        <p>Todavia no tiene publicaciones</p>
      )}
    </div>
  );
}

