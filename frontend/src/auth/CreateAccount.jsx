import { useEffect, useState } from "react";
import axios from "axios";
import "../assets/CreateAccount.css";

function CreateAccount() {
  const [currency, setCurrency] = useState("INR");
  const [accounts, setAccounts] = useState([]);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

 const fetchAccounts = async () => {
  try {
    const res = await axios.get(
      "http://localhost:3000/api/account/myaccount",
      { withCredentials: true }
    );

  console.log(res.data)
    const data = res.data.accounts || res.data;

    setAccounts([res.data.account]);


  } catch (err) {
    console.error("Failed to fetch accounts");
    setAccounts([]);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:3000/api/account/createaccount",
        { currency },
        { withCredentials: true }
      );

      setIsError(false);
      setMessage("Account Created Successfully");
      setShowForm(false);
      fetchAccounts();

    } catch (err) {
      setIsError(true);
      setMessage(`${err.response?.data?.message}`);
    }

    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="account-container">

      <h2 className="title">My Bank Accounts</h2>

      {message && (
        <div className={`toast ${isError ? "error" : "success"}`}>
          {message}
        </div>
      )}

      {/* Existing Accounts */}
      <div className="accounts-grid">
        {accounts.length === 0 ? (
          <p>No accounts found</p>
        ) : (
          accounts.map((acc) => (
   <div key={acc._id} className="account-card">
      <p><strong>ID:</strong> {acc._id}</p>
      <p><strong>Status:</strong> {acc.status}</p>
      <p><strong>Currency:</strong> {acc.currency}</p>
   </div>
))
        )}
      </div>

      {/* Create Button */}
      <div className="create-section">
        {!showForm ? (
          <button
            className="create-btn"
            onClick={() => setShowForm(true)}
          >
            + Create New Account
          </button>
        ) : (
          <form className="create-form" onSubmit={handleSubmit}>
            <label>Select Currency</label>

            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>

            <button type="submit">Create</button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </form>
        )}
      </div>

    </div>
  );
}

export default CreateAccount;
