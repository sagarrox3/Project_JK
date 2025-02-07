import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {createBlog} from '../redux/actions/blogAction';

const BlogForm = () => {
	const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
	const dispatch = useDispatch();
	const submitRef = React.useRef(null);
	const [formData, setFormData] = useState({
		title: '',
		content: '',
		tags: '',
	});
	useEffect(() => {
	}, [isAuthenticated]);
	const handleChange = (e) => {
		setFormData({...formData, [e.target.name]: e.target.value});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		submitRef.current.disabled = true;
		dispatch(createBlog(formData));
		submitRef.current.disabled = false;
		setFormData({
			title: '',
			content: '',
			tags: '',
		});
	};
	if (!isAuthenticated) {
		return <h2>You must be logged in to create a post</h2>;
	}
	return (
		<div className="form-container">
			<form onSubmit={handleSubmit}>
				<h2>Create a Post</h2>

				<label htmlFor="title">Title:</label>
				<input
					type="text"
					id="title"
					name="title"
					value={formData.title}
					onChange={handleChange}
					required
				/>

				<label htmlFor="content">Content:</label>
				<textarea
					id="content"
					name="content"
					value={formData.content}
					minLength={21}
					onChange={handleChange}
					required
				></textarea>

				<label htmlFor="tags">Tags (comma-separated):</label>
				<input
					type="text"
					id="tags"
					name="tags"
					value={formData.tags}
					onChange={handleChange}
				/>

				<button type="submit" ref={submitRef}>
					Submit
				</button>
			</form>

			<style>{`
			.form-container {
				max-width: 420px;
				margin: 50px auto;
				padding: 25px;
				background: #fff;
				border-radius: 10px;
				box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
				font-family: 'Arial', sans-serif;
				transition: transform 0.2s, box-shadow 0.2s;
			}

			.form-container:hover {
				transform: scale(1.02);
				box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
			}

			form {
				display: flex;
				flex-direction: column;
			}

			h2 {
				text-align: center;
				margin-bottom: 20px;
				color: #222;
				font-size: 22px;
			}

			label {
				margin: 10px 0 5px;
				font-weight: 600;
				color: #333;
			}

			input,
			textarea {
				padding: 12px;
				margin-bottom: 15px;
				border: 1px solid #bbb;
				border-radius: 6px;
				font-size: 16px;
				transition: border-color 0.3s ease-in-out;
			}

			input:focus,
			textarea:focus {
				border-color: #007bff;
				outline: none;
				box-shadow: 0 0 5px rgba(0, 123, 255, 0.2);
			}

			textarea {
				height: 120px;
				resize: vertical;
			}

			button {
				background: #007bff;
				color: #fff;
				padding: 12px;
				border: none;
				border-radius: 6px;
				font-size: 16px;
				cursor: pointer;
				transition: background 0.3s ease-in-out, transform 0.2s;
			}

			button:hover {
				background: #0056b3;
				transform: translateY(-2px);
			}

      `}</style>
		</div>
	);
};

export default BlogForm;
