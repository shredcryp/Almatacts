import "./Navbar.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Navbar({ onLogin, onLogout, setSearchQuery }) {
    const [searchInput, setSearchInput] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [identifier, setIdentifier] = useState("");
    const isUserSignedIn = !!localStorage.getItem("token");
    const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const navigate = useNavigate();

    const openSignupModal = () => {
        setIsSignupModalOpen(true);
    };

    const closeSignupModal = () => {
        setIsSignupModalOpen(false);
    };

    const openLoginModal = () => {
        setIsLoginModalOpen(true);
    };

    const closeLoginModal = () => {
        setIsLoginModalOpen(false);
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:3001/signup", {
                username,
                email,
                password,
            });
            closeSignupModal();
            window.location.reload(); // Refresh the page after signing up
        } catch (err) {
            console.log(err);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3001/login", {
                identifier,
                password,
            });
            const token = response.data.token;
            onLogin(token);
            localStorage.setItem("token", token);
            closeLoginModal();
            window.location.reload(); // Refresh the page after logging in
        } catch (err) {
            console.log(err);
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchInput(query);
        setSearchQuery(query); // Call setSearchQuery from the parent component
    };

    return (
        <>
            <nav>
                <div className="leftnav">
                    <Link to="/">Almatacts</Link>
                </div>

                <div className="search">
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchInput}
                        onChange={handleSearch}
                    />
                </div>

                <div className="rightnav">
                    {isUserSignedIn ? (
                        <button
                            className="logoutbutton"
                            onClick={() => {
                                onLogout();
                                localStorage.removeItem("token"); // Clear token when logging out
                                window.location.reload(); // Refresh the page after logging out
                            }}
                        >
                            Logout
                        </button>
                    ) : (
                        <div className="entry">
                            <button className="signupbutton" onClick={openSignupModal}>
                                SignUp
                            </button>
                            <button className="loginbutton" onClick={openLoginModal}>
                                LogIn
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* Signup Modal */}
            {isSignupModalOpen && (
                <div className="modal" onClick={closeSignupModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={closeSignupModal}>&times;</span>
                        <h3>Signup</h3>
                        <form onSubmit={handleSignup}>
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <div className="modal-signup-button">
                                <button type="submit">Signup</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Login Modal */}
            {isLoginModalOpen && (
                <div className="modal" onClick={closeLoginModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={closeLoginModal}>&times;</span>
                        <h3>Login</h3>
                        <form onSubmit={handleLogin}>
                            <input
                                type="text"
                                placeholder="Username or Email"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button type="submit">Login</button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default Navbar;
