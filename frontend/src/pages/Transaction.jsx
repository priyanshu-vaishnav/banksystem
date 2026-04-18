import { useEffect, useState } from "react";
import axios from "axios";
import "../assets/MyTransaction.css";

function Transactions() {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/transactions/mytransaction",
        { withCredentials: true }
      );

      setData(res.data.transactions);

    } catch (err) {
      setMessage("Failed to load transactions");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (

    <div className="transactions-table-wrapper">

        
   
    <div className="transactions-container">
      <h2>Transaction History</h2>

      {message && <div className="toast-error">{message}</div>}

      <table className="transactions-table">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((txn) => (
            <tr key={txn._id}>
              <td>{txn.transactionId}</td>
              <td
                style={{
                  color: txn.type === "DEBIT" ? "red" : "green",
                  fontWeight: "bold"
                }}
              >
                {txn.type}
              </td>
              <td>₹ {txn.amount}</td>
              <td>{txn.status}</td>
              <td>{new Date(txn.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
     </div>
  );
}

export default Transactions;
