import axios from 'axios';

const API_URL = 'http://localhost:8080/posts';


const getALl = async()=>{
    const res = await axios.get(API_URL);
    return res.data
};

const searchByTitle = async(title)=> {
    const res = await axios.get(`${API_URL}/title/${title}`);
    return res.data
}

const postService = {
    getALl,
    searchByTitle
};



export default postService