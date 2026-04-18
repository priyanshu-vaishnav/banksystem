import { useEffect, useState } from "react";
import axios from "axios";
import "../assets/Myaccount.css";

function MyAccount() {
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetchAccount();
  }, []);

  const fetchAccount = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/account/myaccount",
        { withCredentials: true }
      );

      setData(res.data);
      setIsError(false);
      setMessage("Account Loaded");
      setTimeout(() => setMessage(""), 3000);

    } catch (err) {
      setIsError(true);
      setMessage("Failed to load account");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const copyAccountId = () => {
    navigator.clipboard.writeText(data.account._id);
    setMessage("Account ID Copied");
    setIsError(false);
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="account-page">
      <h2 className="account-title">My Account</h2>

      {message && (
        <div className={`toast ${isError ? "error" : "success"}`}>
          {message}
        </div>
      )}

      {!data ? (
        <p>Loading...</p>
      ) : (
        <div className="account-card">

          <h3>Account Details</h3>

          <div className="account-id-row">
            <span><strong>Account ID:</strong> {data.account._id}</span>
            <button onClick={copyAccountId} className="copy-btn">
              Copy
            </button>
          </div>

          <p><strong>Status:</strong> {data.account.status}</p>
          <p><strong>Currency:</strong> {data.account.currency}</p>
          <p><strong>Balance:</strong> ₹ {data.balance}</p>
          <p><strong>Created At:</strong> {new Date(data.account.createdAt).toLocaleString()}</p>

          <hr />

          <h3>User Details</h3>
          <p><strong>Name:</strong> {data.account.user.name}</p>
          <p><strong>Email:</strong> {data.account.user.email}</p>

        </div>
      )}
    </div>
  );
}

export default MyAccount;
