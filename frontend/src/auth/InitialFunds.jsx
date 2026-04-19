import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../assets/InitialFunds.css";
import "../assets/Global.css";

function InitialFunds() {
  const navigate = useNavigate();
  const [isSystemUser, setIsSystemUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkSystemUser();
  }, []);

  const checkSystemUser = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/check-system-user`,
        { withCredentials: true }
      );
      setIsSystemUser(res.data.isSystemUser);
    } catch (err) {
      setIsSystemUser(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/transaction/system/initialfunds`,
        { toAccount, amount: parseFloat(amount), transactionId },
        { withCredentials: true }
      );

      setIsError(false);
      setMessage("Initial funds added successfully!");
      setToAccount("");
      setAmount("");
      setTransactionId("");

    } catch (err) {
      setIsError(true);
      if (err.response?.data?.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }

    setTimeout(() => setMessage(""), 4000);
  };

  if (loading) {
    return (
      <div className="initial-funds-container">
        <div className="card">
          <div style={{ textAlign: 'center', padding: '20px' }}>
            Checking permissions...
          </div>
        </div>
      </div>
    );
  }

  if (!isSystemUser) {
    return (
      <div className="initial-funds-container">
        <div className="card">
          <h2 className="card-title">Access Denied</h2>
          <p className="description">You don't have permission to access this page.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="submit-btn"
            style={{ marginTop: '20px' }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="initial-funds-container">
      <div className="card">
        <h2 className="card-title">Add Initial Funds</h2>
        <p className="description">Add initial funds to a user account (System User Only)</p>

        {message && (
          <div className={`toast-${isError ? "error" : "success"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="initial-funds-form">
          <div className="form-group">
            <label htmlFor="toAccount">Recipient Account ID</label>
            <input
              type="text"
              id="toAccount"
              value={toAccount}
              onChange={(e) => setToAccount(e.target.value)}
              placeholder="Enter account ID"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="0"
              step="0.01"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="transactionId">Transaction ID</label>
            <input
              type="text"
              id="transactionId"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter transaction ID"
              required
              disabled={isLoading}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Processing..." : "Add Initial Funds"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default InitialFunds;