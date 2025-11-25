import axios from 'axios';

const API_URL= 'http://localhost:8080/users';

const register = async (formData)=> {
    const res = await axios.post(API_URL,formData);
    return res.data

};

const login = async(userData)=> {
    try {
        const res = await axios.post(API_URL + '/login',userData)
        if(res.data){
            localStorage.setItem("user",JSON.stringify(res.data.user));
            localStorage.setItem("token",res.data.token);
        }
        return res.data
    } catch(error) {
        throw error; // Lanza el error para que Redux lo capture
    };
};


const logout = async ()=>{
    const token= localStorage.getItem("token");
    const res = await axios.delete(API_URL + '/logout',{
        headers:{
            authorization: token
        },
    });
    if(res.data){
        localStorage.clear();
    }
    return res.data
};



const authService = {
    register,
    login,
    logout
};


export default authService


