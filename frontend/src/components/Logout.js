import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../redux/actions/authActions";
import { useEffect } from "react";

export const Logout = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	
	useEffect(() => {
		dispatch(logoutUser());
		navigate('/home');
	}, []);

	return (
		<div>
			<h1>Logout</h1>
		</div>
	);
};
