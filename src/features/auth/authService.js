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
    try {
        const token = localStorage.getItem("token");
        if (token) {
            await axios.delete(API_URL + '/logout', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
        }
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        return { success: true };
    } catch(error) {
        // Aunque falle la petición, limpiamos el localStorage
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        throw error;
    }
};



const authService = {
    register,
    login,
    logout
};


export default authService


