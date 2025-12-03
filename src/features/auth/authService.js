import axios from 'axios';

const API_URL= 'http://localhost:8080/users';

const register = async (formData)=> {
    try {
        // Si formData es una instancia de FormData, axios detecta automáticamente
        // y establece el Content-Type a multipart/form-data (con el boundary correcto)
        // NO especifiques Content-Type manualmente, axios lo hace automáticamente
        const res = await axios.post(API_URL, formData);
        return res.data;
    } catch(error) {
        throw error
    }
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

const getUserProfile = async () => {
    try {
        const token = localStorage.getItem("token");
        if (token) {
            const res = await axios.get(API_URL + '/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return res.data;
        }
    } catch(error) {
        console.error(error);
        throw error;
    }
};

const toggleFollow = async (userId) => {
    try {
        const token = localStorage.getItem("token");
        if (token) {
            const res = await axios.post(
                API_URL + '/follow/' + userId,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            return res.data;
        }
    } catch(error) {
        console.error(error);
        throw error;
    }
};

const authService = {
    register,
    login,
    logout,
    getUserProfile,
    toggleFollow
};


export default authService


