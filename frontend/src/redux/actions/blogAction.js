import { useSelector } from 'react-redux';
import api from '../../utils/axiosConfig.js';
import {
  fetchBlogsStart,
  fetchBlogsSuccess,
  fetchBlogsFailure,
  fetchBlogStart,
  fetchBlogSuccess,
  fetchBlogFailure,
  createBlogStart,
  createBlogSuccess,
  createBlogFailure
} from '../slices/blogSlice';

// Fetch all blogs
export const fetchBlogs = () => async (dispatch) => {
  try {
    dispatch(fetchBlogsStart());
    const response = await api.get('http://localhost:3000/blogs');
    dispatch(fetchBlogsSuccess(response.data));
  } catch (error) {
    dispatch(fetchBlogsFailure(error.message));
  }
};

// Fetch single blog by ID
export const fetchBlogById = (id) => async (dispatch) => {
  try {
    dispatch(fetchBlogStart());
    const response = await api.get(`http://localhost:3000/blogs/${id}`);
    dispatch(fetchBlogSuccess(response.data));
  } catch (error) {
    dispatch(fetchBlogFailure(error.message));
  }
};

// Create new blog
export const createBlog = (blogData) => async (dispatch) => {
  try {
    dispatch(createBlogStart());
    const userEmail = useSelector((state) => state.auth.user.email);
    const response = await api.post('http://localhost:3000/blogs', blogData);
    dispatch(createBlogSuccess(response.data));
    return response.data;
  } catch (error) {
    dispatch(createBlogFailure(error.message));
    alert(`Failed to create blog ${error.message}`, );
  }
};
