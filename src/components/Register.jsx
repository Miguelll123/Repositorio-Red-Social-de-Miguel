import React,{useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from '../features/authSlice';
import {notification} from 'antd';

const Register = ()=> {
    const [formData,setFormData] = useState({
        username:'',
        email:'',
        password:'',
        password2:'',
        image: null // Para guardar el archivo de imagen
    });

  const {username,email,password,password2, image}= formData

  const dispatch = useDispatch();
  const {isSucces,message,isError}= useSelector((state)=>state.auth)

   useEffect(()=>{
    if(isSucces && message){
        notification.success({
            message:"Success",
            description:message
        })
    }
    if(isError){
        notification.error({message:"Error",description:message})
    }
    dispatch(reset())
   },[isSucces, message,isError])

  const onChange = (e)=> {
   // Si es un input de tipo file, guardamos el archivo directamente
   if(e.target.type === 'file'){
    setFormData({
     ...formData,
     [e.target.name]: e.target.files[0] // files[0] es el primer archivo seleccionado
    })
   } else {
    setFormData({
     ...formData,
     [e.target.name]:e.target.value,
    })
   }
  }

  const onSubmit = (e) => {
    e.preventDefault();
    if(password !== password2){
        return notification.error({
            message:'Error',
            description:"Passwords do not match",
        });
    } else {
    // Crear FormData para enviar multipart/form-data
    const formDataToSend = new FormData();
    formDataToSend.append('username', username);
    formDataToSend.append('email', email);
    formDataToSend.append('password', password);
    // Solo añadir la imagen si existe
    if(image){
      formDataToSend.append('image', image);
    }
    
    dispatch(register(formDataToSend));
    console.log('FormData enviado:', {username, email, password, hasImage: !!image});
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input type='text' name='username' value={username} onChange={onChange} placeholder='Username' />
      <input type='email' name='email' value={email} onChange={onChange} placeholder='Email' />
      <input type='password' name='password' value={password} onChange={onChange} placeholder='Password' />
      <input type='password' name='password2' value={password2} onChange={onChange} placeholder='Confirm Password'/>
      {/* Input para subir imagen */}
      <input 
        type='file' 
        name='image' 
        accept='image/*' 
        onChange={onChange} 
      />
      {image && <p>Imagen seleccionada: {image.name}</p>}
      <button type='submit'>Register</button>
    </form>
  )
}
export default Register 