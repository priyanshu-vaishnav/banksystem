import { useState } from "react";
import axios from "axios";
import '../assets/Global.css'

function SendMoney() {
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount]       = useState("");
  const [message, setMessage]     = useState("");
  const [isError, setIsError]     = useState(false);
  const [loading, setLoading]     = useState(false);
  const [receiver, setReceiver]   = useState(null);
  const [searching, setSearching] = useState(false);

  // Step 1 — Account ID se receiver dhundho (jab input se bahar jao)
  const fetchReceiver = async () => {
    if (!toAccount.trim()) return;
    setSearching(true);
    try {
      const res = await axios.get(`http://localhost:3000/api/account/getaccount/${toAccount}`, { withCredentials: true });
      setReceiver(res.data.account);
    } catch {
      setReceiver({ error: true });
    }
    setSearching(false);
  };

  // Step 2 — Paise bhejo
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:3000/api/transactions/sendmoney",
        { toAccount, amount: Number(amount), transactionId: crypto.randomUUID() },
        { withCredentials: true }
      );
      setMessage("Transaction Successful! ✓");
      setIsError(false);
      setToAccount(""); setAmount(""); setReceiver(null);
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.message || "Transaction Failed");
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="page-container">
      <div className="card">
        <h2 className="card-title">Send Money</h2>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Receiver Account ID</label>
            <input
              type="text"
              placeholder="Paste Account ID here"
              value={toAccount}
              onChange={(e) => { setToAccount(e.target.value); setReceiver(null); }}
              onBlur={fetchReceiver}
              required
            />

            {/* 3 states — searching, not found, found */}
            {searching && <p className="hint">Searching...</p>}
            {receiver?.error && <div className="receiver-box error">✗ Account not found</div>}
            {receiver && !receiver.error && (
              <div className="receiver-box success">
                <p>✓ <strong>{receiver.user.name}</strong> — {receiver.user.email}</p>
                <p>Status: {receiver.status} | Currency: {receiver.currency}</p>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              placeholder="Enter amount"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Money →"}
          </button>

        </form>

        {message && <div className={`toast ${isError ? "toast-error" : "toast-success"}`}>{message}</div>}

      </div>
    </div>
  );
}

export default SendMoney;