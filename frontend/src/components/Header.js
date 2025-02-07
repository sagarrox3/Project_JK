import { useSelector } from 'react-redux';
import './Header.css';
import { useEffect } from 'react';

const Header = () => {
	const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

	useEffect(() => {
	}, [isAuthenticated]);
	return (
		<header className="header">
			<nav>
				<ul className="nav-links">
					<li>
						<a href="home">Home</a>
					</li>
					<li>
						<a href="/create">Create New Blog</a>
					</li>
					{!isAuthenticated && <li>
						<a href="/login">Log In</a>
					</li>}
					{isAuthenticated && <li>
						<a href="/logout">Log Out</a>
					</li>}
				</ul>
			</nav>
		</header>
	);
};

export default Header;
