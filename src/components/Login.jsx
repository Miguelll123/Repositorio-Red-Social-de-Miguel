import React, { useState,useEffect } from 'react';
import { login  } from '../features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;


  const dispatch = useDispatch();
  const navigate = useNavigate();


  const {user} = useSelector(state=>state.auth);

   useEffect(()=>{
    if(user){
      navigate('/')
    }
   },[user,navigate])
  

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData))
  };

  return (
    <form onSubmit={onSubmit}>
      <input type='email' name='email' value={email} onChange={onChange} />
      <input type='password' name='password' value={password} onChange={onChange} />
      <button type='submit'>Login</button>
    </form>
  );
};


export default Login