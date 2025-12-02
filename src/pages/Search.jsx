
import { useSelector,useDispatch } from "react-redux";
import {useParams,useNavigate} from "react-router-dom";
import { useState,useEffect } from "react";
import {Input} from 'antd';
import { getALl,searchByTitle } from "../features/posts/postSlice";
import Post from './Posts/Post';


export default function Search() {

const {searchTerm} = useParams();
const navigate = useNavigate();
const dispatch = useDispatch();
const [title,setTitle] = useState(searchTerm || "");
const {posts,isLoading}= useSelector(state=>state.posts);


useEffect(()=>{
  if(!searchTerm){
    dispatch(getALl())
  };
},[]);

useEffect(()=>{
  if(searchTerm){
    dispatch(searchByTitle(searchTerm))
  } else {
    dispatch(getALl())
  }
},[searchTerm,dispatch]);

//USEFECT para recoger por cada letra que escriba 

useEffect(()=>{
  if(title.length > 2){
    const timer = setTimeout(()=>{
      navigate(`/search/${title.trim()}`); // ← Faltaba la barra inicial
    },500)
    return () => clearTimeout(timer); // ← IMPORTANTE: Limpiar el timer
  } else if(title.length === 0){
    // Si borras todo, volver a /search
    navigate('/search');
  }
},[title,navigate])

// Función handleSearch: Conectar input con URL

const handleSearch = (value)=> {
  if(value.trim()){
    navigate(`/search/${value.trim()}`)
  } else {
    navigate('/search')
  }

}
 
  return (
  <div className="Total-container">
    <h1>Buscador</h1>
    
    <Input.Search
      placeholder="Buscar posts por título..."
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      onSearch={handleSearch}
      enterButton="Buscar"
      size="large"
      style={{ marginBottom: '20px', maxWidth: '500px' }}
    />

    {isLoading && <p>Cargando...</p>}

    <div className="Post-Container" style={{width:'100%', marginBottom:'50px'}}>
      {!isLoading && (
        <div className="container-renderizado" style={{width:'100%'}}>
          {searchTerm && (
            <p style={{marginBottom:'20px'}}>Resultados para: <strong>{searchTerm}</strong></p>
          )}

          {posts && posts.length > 0 ? (
            <Post />
          ) : (
            <p>No se encontraron posts</p>
          )}
        </div>
      )}
    </div>
  </div>
);

}