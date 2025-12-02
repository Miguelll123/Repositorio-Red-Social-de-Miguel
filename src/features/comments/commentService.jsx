
import axios from 'axios';
const API_URL = "http://localhost:8080/comments";


const getCommentsByPost = async (postId) => {
    const res = await axios.get(`${API_URL}/post/${postId}`);
    return res.data
};

const createComment = async (postId,comment,token)=> {
   const res = await axios.post(`${API_URL}/post/${postId}`,{comment},
    {
        headers: {
            Authorization: `Bearer ${token}`
        },
    }
   );
   return res.data
};


const commentService = {
    getCommentsByPost,
    createComment
}

export default commentService;