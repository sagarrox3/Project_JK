import {configureStore} from '@reduxjs/toolkit';
import blogReducer from './slices/blogSlice';
import authReducer from './slices/authSlice';

const store = configureStore({
	reducer: {
		blog: blogReducer,
		auth: authReducer
	},
});

export default store;