import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/Navbar.css";


function Navbar({ isLoggedIn, setIsLoggedIn }) {

    const [isOpen, setIsOpen] = useState(false);

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post(
                "http://localhost:3000/api/auth/logout",
                {},
                { withCredentials: true }
            );

            setIsLoggedIn(false);
            navigate("/login");

        } catch (error) {
            console.log("Logout error");
        }
    };

    return (
        <nav className="navbar">
            <div className="logo">TruePay</div>

            <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
                ☰
            </div>

            <div className={`nav-links ${isOpen ? "open" : ""}`}>

                {!isLoggedIn && (
                    <>
                        <NavLink to="/" onClick={() => setIsOpen(false)}>Register</NavLink>
                        <NavLink to="/login" onClick={() => setIsOpen(false)}>Login</NavLink>
                    </>
                )}

                {isLoggedIn && (
                    <>

                        <NavLink to='/dashboard' onClick={() => setIsOpen(false)}>DashBoard</NavLink>
                        <NavLink to="/sendmoney" onClick={() => setIsOpen(false)}>Send Money</NavLink>
                        <NavLink to="/transaction" onClick={() => setIsOpen(false)}>Transactions</NavLink>
                        <NavLink to = '/setting' onClick={() => setIsOpen(false)}>Settings</NavLink>
                      
                        <button onClick={handleLogout} style={{padding: "10px", background: "red", color: "white", border: "none", borderRadius: "4px", cursor: "pointer",width:"80px"}}>
                            Logout
                        </button>
                    </>
                )}

            </div>
        </nav>
    );
}

export default Navbar;