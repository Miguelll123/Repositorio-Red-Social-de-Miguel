import axios from "axios";

const API_URL = "http://localhost:8080/posts";

const getAll = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

const searchByTitle = async (title) => {
  const res = await axios.get(`${API_URL}/title/${title}`);
  return res.data;
};

const like = async (_id, token) => {
  try {
    const res = await axios.put(
      `${API_URL}/like/${_id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    // Si el error es 400 (ya dio like), lanzar el error para que Redux lo maneje
    if (error.response && error.response.status === 400) {
      throw error;
    }
    throw error;
  }
};

const postService = {
  getAll,
  searchByTitle,
  like,
};

export default postService;
