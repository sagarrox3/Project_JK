import { createSlice } from '@reduxjs/toolkit';

const blogSlice = createSlice({
  name: 'blog',
  initialState: {
    blogs: [],
    currentBlog: null,
    loading: false,
    error: null,
    createSuccess: false
  },
  reducers: {
    fetchBlogsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchBlogsSuccess: (state, action) => {
      state.loading = false;
      state.blogs = action.payload.blogs;
      state.error = null;
    },
    fetchBlogsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch single blog
    fetchBlogStart: (state) => {
      state.loading = true;
      state.error = null;
      state.currentBlog = null;
    },
    fetchBlogSuccess: (state, action) => {
      state.loading = false;
      state.currentBlog = action.payload;
      state.error = null;
    },
    fetchBlogFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create blog
    createBlogStart: (state) => {
      state.loading = true;
      state.error = null;
      state.createSuccess = false;
    },
    createBlogSuccess: (state, action) => {
      state.loading = false;
      state.blogs.unshift(action.payload);
      state.error = null;
      state.createSuccess = true;
    },
    createBlogFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.createSuccess = false;
    },
    resetCreateSuccess: (state) => {
      state.createSuccess = false;
    }
  }
});

export const {
  fetchBlogsStart,
  fetchBlogsSuccess,
  fetchBlogsFailure,
  fetchBlogStart,
  fetchBlogSuccess,
  fetchBlogFailure,
  createBlogStart,
  createBlogSuccess,
  createBlogFailure,
  resetCreateSuccess
} = blogSlice.actions;

export default blogSlice.reducer;