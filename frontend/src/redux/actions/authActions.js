import {
	loginFailure,
	loginStart,
	loginSuccess,
	logout,
} from '../slices/authSlice';

export const loginUser = (email, password) => async (dispatch) => {
	try {
		dispatch(loginStart());
		const URL = 'http://localhost:3000/auth/login';
		const response = await fetch(URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({email, password}),
		});

		if (!response.ok) {
			throw new Error('Login failed');
		}

		const data = await response.json();
		const token = data.access_token;

		localStorage.setItem('token', token);
		localStorage.setItem('email', email);
		dispatch(loginSuccess({token, email}));
	} catch (error) {
		dispatch(loginFailure(error.message));
	}
};

export const loginWithGoogle = (googleToken) => async (dispatch) => {
	try {
		dispatch(loginStart());

		const response = await fetch('http://localhost:3000/auth/login/google', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({token: googleToken}),
		});

		if (!response.ok) {
			throw new Error('Google login failed');
		}

		const data = await response.json();
		localStorage.setItem('token', data.access_token);

		dispatch(
			loginSuccess({
				token: data.access_token,
				user: data.user,
				authMethod: 'google',
			})
		);
	} catch (error) {
		dispatch(loginFailure(error.message));
	}
};

export const logoutUser = () => (dispatch) => {
	console.log('Logging out');
	localStorage.removeItem('token');
	dispatch(logout());
};
