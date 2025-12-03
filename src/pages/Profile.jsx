import { useSelector,useDispatch } from "react-redux";
import { Card, Avatar,Tabs } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useState,useEffect } from "react";
import { getUserProfile } from "../features/authSlice";


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
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('posts');
   
// USEEFFECT para montar FOLLOWERS

  useEffect(()=>{
    if(activeTab === 'followers' || activeTab === 'following') {
      dispatch(getUserProfile())
    }
  },[activeTab])

// MONTAR LOS SEGUIDORES RECORRIENDOLOS

const followElements = user?.followers?.map((follower)=>{
      const followeImageUrl = follower?.image ?
      (follower.image.startsWith('http')) ?
      convertImgurUrl(follower.image) :
      `${API_URL}/${follower.image}` : null

      return (
        <div key={follower._id} style={{display:'flex',alignItems:'center',gap:'12px'}}>
       <Avatar src={followeImageUrl} icon={<UserOutlined/>} />
       <span>{follower.username}</span>
       <button>Follow</button>
       <button>Unfollow</button>
        </div>
      )
});

const folllowingElements = user?.following?.map((followi)=>{
  const followingImageUrl = followi?.image ?
  (followi.image.startsWith('http')) ?
  convertImgurUrl(followi.image) :
  `${API_URL}/${followi.image}` : null

  return (
    <div key={followi._id} style={{display:'flex',alignItems:'center',gap:'12px'}}>
    <Avatar src={followingImageUrl} icon={<UserOutlined/>}/>
    <span>{followi.username}</span>
    <button>Follow</button>
    <button>UnFollow</button>
    </div>
  )
});



  const imageUrl = user?.image 
    ? (user.image.startsWith('http')
        ? convertImgurUrl(user.image)
        : `${API_URL}/${user.image}`)
    : null;

  const userPosts = posts.filter((post) => {
    if (!post.author || !user) return false;
    return String(post.author._id) === String(user._id);
  });

  const postElements = userPosts.map((post) => {
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

  // 🔥 RETURN CORREGIDO GRAMATICALMENTE — MISMO CONTENIDO QUE TÚ TENÍAS
  return (
    <div className="Profile-container" style={{maxWidth:'800px',margin:'0 auto',padding:'40px 0'}}>
      
      <div className="Profile-header" 
           style={{display:'flex',alignItems:'center',gap:'20px', marginBottom:'30px',justifyContent:'center'}}>
        
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

      <Tabs style={{display:'flex',alignItems:'center',justifyContent:'center'}}
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
        {
          key: 'posts',
          label: `Mis Posts (${userPosts.length})`,
          children: <div>{postElements}</div> // ← Aquí van los posts
        },
        {
          key: 'followers',
          label: `Seguidores (${user?.followers?.length || 0})`,
          children: <div>{followElements}</div> // ← Aquí van los seguidores
        },
        {
          key: 'following',
          label: `Siguiendo (${user?.following?.length || 0})`,
          children: <div>{folllowingElements}</div> // ← Aquí van los following
        }
      ]}
      />
    
    </div>
  );
}
