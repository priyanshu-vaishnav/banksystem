import { useState } from "react";
import axios from "axios";
import '../assets/Global.css'
import { useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [validationError, setValidationError] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:3000/api/auth/register",
        { name, email, password },
        { withCredentials: true }
      );

      setIsError(false);

      setMessage("Registration Successful");

      setTimeout(() => {
        setMessage("")
        navigate("/dashboard");

      }, 3000);

    } catch (error) {

      setIsError(true);

      if (error.response?.data?.errors) {
        // express-validator errors
        setValidationError(error.response.data.errors);
        setMessage(""); // main message clear
      } else {
        setValidationError([]);
        setMessage(
          error.response?.data?.message || "Registration Failed"
        );
      }

      setTimeout(() => {
        setMessage("");
        setValidationError([]);
      }, 4000);
    }
  };

  return (
    <div className="page-container">
      <div className="card">
        <h2 className="card-title">Create Account</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="primary-btn" type="submit">
            Register
          </button>
        </form>

        {validationError.length > 0 && (
          <div style={{
            marginTop: "15px",
            padding: "10px",
            borderRadius: "6px",
            backgroundColor: "#fee2e2",
            color: "#b91c1c",
            fontWeight: "500"
          }}>
            {validationError.map((err, index) => (
              <div key={index}>{err.msg}</div>
            ))}
          </div>
        )}
          {message && (
  <div className={isError ? "toast-error" : "toast-success"}>
    {message}
  </div>
)}
      </div>
    </div>
  );
}

export default Register;
