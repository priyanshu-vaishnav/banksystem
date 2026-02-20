import { useEffect, useState } from "react";
import axios from "axios";
import "../assets/CreateAccount.css";
import "../assets/Global.css";

function CreateAccount() {

  const [currency, setCurrency] = useState("INR");
  const [phoneno, setPhoneno] = useState("");
  const [address, setAddress] = useState("");
  const [documentid, setDocumentid] = useState("");

  const [accounts, setAccounts] = useState([]);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  // ← new

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/account/myaccount",
        { withCredentials: true }
      );
      const data = res.data.accounts || [];
      setAccounts(data);
    } catch (err) {
      setAccounts([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);  // ← start loading

    try {
      await axios.post(
        "http://localhost:3000/api/account/createaccount",
        { currency, phoneno, address, documentid },
        { withCredentials: true }
      );

      setIsError(false);
      setMessage("Account Created Successfully");
      setShowForm(false);

      setPhoneno("");
      setAddress("");
      setDocumentid("");

      fetchAccounts();

    } catch (err) {
      setIsError(true);

      if (err.response?.data?.errors) {
        setMessage(err.response.data.errors.join(", "));
      } else if (err.response?.data?.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Something went wrong");
      }
    } finally {
      setIsLoading(false);  // ← stop loading always
    }

    setTimeout(() => setMessage(""), 4000);
  };

  return (
    <div className="account-container">

      <h2 className="title">My Bank Accounts</h2>

      {message && (
        <div className={`toast-${isError ? "error" : "success"}`}>
          {message}
        </div>
      )}

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

      <div className="create-section">

        {!showForm ? (
          <button
            className="create-btn"
            onClick={() => setShowForm(true)}
          >
            + Create New Account
          </button>
        ) : (

          <div className="form-group">
            <form className="create-form" onSubmit={handleSubmit}>

              <label>Select Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                disabled={isLoading}
              >
                <option value="INR">INR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  value={phoneno}
                  onChange={(e) => setPhoneno(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label>Document ID</label>
                <input
                  type="text"
                  value={documentid}
                  onChange={(e) => setDocumentid(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="flex">
                <button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating your account..." : "Create"}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowForm(false)}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        )}
      </div>

    </div>
  );
}

export default CreateAccount;