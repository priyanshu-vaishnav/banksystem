import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../assets/Global.css'

function Login({ setIsLoggedIn }) {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      setIsError(false);
      setMessage("Login Successful");

      setIsLoggedIn(true); // 🔥 important line

      setTimeout(() => {
        setMessage("");
        navigate("/createaccount"); // redirect after login
      }, 1000);

    } catch (err) {
      setIsError(true);
      setMessage("Invalid Email or Password");
      setTimeout(() => setMessage(""), 3500);
    }
  };

  return (
    <div className="page-container">
      <div className="card">
        <h2 className="card-title">Welcome Back</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="primary-btn" type="submit">
            Login
          </button>
        </form>

        {message && (
  <div
    style={{
      marginTop: "15px",
      padding: "10px",
      borderRadius: "6px",
      backgroundColor: isError ? "#fee2e2" : "#dcfce7",
      color: isError ? "#b91c1c" : "#166534",
      fontWeight: "500",
      textAlign: "center"
    }}
  >
    {message}
  </div>
)}

      </div>
    </div>
  );
}

export default Login;
