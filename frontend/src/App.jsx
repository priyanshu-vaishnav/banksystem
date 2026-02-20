import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Register from '../src/auth/Register.jsx'
import Login from '../src/auth/Login.jsx';
import MyAccount from '../src/auth/MyAccount.jsx';
import SendMoney from '../src/pages/SendMoney.jsx';
import Navbar from './components/Navbar.jsx';
import Transactions from '../src/pages/Transaction.jsx';
import CreateAccount from '../src/auth/CreateAccount.jsx';
import Dashboard from '../src/pages/Dashboard.jsx';
import Setting from '../src/pages/Setting.jsx';
import AccountControl from '../src/pages/AccountControl.jsx';


function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter>

      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <Routes>


        <Route path="/" element={<Register />} />

        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />

        <Route path="/createaccount" element={isLoggedIn ? <CreateAccount /> : <Login setIsLoggedIn={setIsLoggedIn} />} />

        <Route path="/myaccount" element={isLoggedIn ? <MyAccount /> : <Login setIsLoggedIn={setIsLoggedIn} />} />

        <Route path='/dashboard' element={isLoggedIn ? <Dashboard /> : <Login setIsLoggedIn={setIsLoggedIn} />} />

        <Route path="/sendmoney" element={isLoggedIn ? <SendMoney /> : <Login setIsLoggedIn={setIsLoggedIn} />} />

        <Route path="/transaction" element={isLoggedIn ? <Transactions /> : <Login setIsLoggedIn={setIsLoggedIn} />} />

        <Route path = "/setting" element = {isLoggedIn ? <Setting /> : <Login setIsLoggedIn={setIsLoggedIn} />} />

        <Route path='/account-control' element = {isLoggedIn ? <AccountControl /> : <Login setIsLoggedIn={setIsLoggedIn} />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;