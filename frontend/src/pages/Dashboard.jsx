import { useEffect, useState } from "react";
import axios from "axios";
import "../assets/Dashboard.css";


function Dashboard() {
  const [accountData, setAccountData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [hideBalance, setHideBalance] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const accountRes = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/account/myaccount`,
        { withCredentials: true }
      );

      const txnRes = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/transactions/mytransaction`,
        { withCredentials: true }
      );

      setAccountData(accountRes.data);
      setTransactions(txnRes.data.transactions);
      setLoading(false);

    } catch (err) {
      console.error("Dashboard load failed:", err);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-page" style={{ padding: '25px'}}><p>Loading dashboard...</p></div>;
  }

  if (!accountData) {
    return <div className="dashboard-page" style={{ padding: '25px' }}><p>Failed to load data</p></div>;
  }

  const { account, balance } = accountData;

  const showBal = () =>{

   if (hideBalance) return setHideBalance(false)
   return setHideBalance(true)

  }

  return (

    <div className="dashboard-container">

      <h2 className="dashboard-title">Bank Dashboard</h2>

      <div className="balance-card">
  

        <h4>Available Balance</h4>
      <div className="showBalCard">
        {hideBalance?(
        <button  onClick={showBal} className="hideBalBtn">

        Hide Bal
        </button>
):(  <button  onClick={showBal} className="hideBalBtn">

        Show Bal
        </button>)}
        </div>
      
      { hideBalance ? (<h1>₹ {balance}</h1>):( <h1>₹ ********</h1>)}
      </div>

      <div className="dashboard-grid">

        <div className="left-section">
          <div className="card">
            <h3>Account Information</h3>
            <p><strong>Account ID:</strong> {account._id}</p>
            <p><strong>Status:</strong> {account.status}</p>
            <p><strong>Currency:</strong> {account.currency}</p>
            <p><strong>Created At:</strong> {new Date(account.createdAt).toLocaleString()}</p>
          </div>

          <div className="card">
            <h3>User Details</h3>
            <p><strong>Name:</strong> {account.user.name}</p>
            <p><strong>Email:</strong> {account.user.email}</p>
          </div>
        </div>

        <div className="right-section">
          <div className="card">
            <h3>Recent Transactions</h3>

            <div className="table-wrapper">
              <table className="txn-table">
                <thead>
                  <tr>
                    <th>Txn ID</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn) => (
                    <tr key={txn._id}>
                      <td>{txn.transactionId}</td>
                      <td className={txn.type === "DEBIT" ? "debit" : "credit"}>
                        {txn.type}
                      </td>
                      <td>₹ {txn.amount}</td>
                      <td>{txn.status}</td>
                      <td>{new Date(txn.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>

      </div>

    </div>

  );
}

export default Dashboard;
