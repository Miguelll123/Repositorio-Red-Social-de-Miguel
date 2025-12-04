import React,{useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from '../features/authSlice';
import {notification} from 'antd';
import './Register.css';
import { Form, Input, Button, Upload } from 'antd';

const Register = ()=> {
    const [formData,setFormData] = useState({
        
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

  const onFinish = (values) => {
    if(values.password !== values.password2){
        return notification.error({
            message:'Error',
            description:"Passwords do not match",
        });
    } else {
    // Crear FormData para enviar multipart/form-data
    const formDataToSend = new FormData();
    formDataToSend.append('username', values.username);
    formDataToSend.append('email', values.email);
    formDataToSend.append('password', values.password);
    // Solo añadir la imagen si existe
    if(image){
      formDataToSend.append('image', image);
    }
    
    dispatch(register(formDataToSend));
    console.log('FormData enviado:', {username, email, password, hasImage: !!image});
    }
  };

  return (
    
    <Form className='register-container' onFinish={onFinish}>
      <Form.Item  name='username' ><Input placeholder='Username'/></Form.Item>
      <Form.Item  name='email'><Input placeholder='email'/></Form.Item>
      <Form.Item name='password'><Input placeholder='Password'/></Form.Item>
      <Form.Item  name='password2'><Input placeholder='password 2'/></Form.Item>
      {/* Input para subir imagen */}
      <Form.Item name='image'>
        <Input type='file' name='image' accept='image/*' onChange={onChange}/></Form.Item>
      
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form>
  )
}
export default Register 


