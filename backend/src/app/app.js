
const express = require("express");   // express framework
const cookie = require("cookie-parser") //middleware
const cors = require("cors"); // cros-origin-resource-sharing
const authRoutes = require('../routes/auth.routes.js') // routes of authentication
const accRoutes = require('../routes/accounts.routes.js') // routes of accounts
const transactionRoutes = require('../routes/transaction.routes.js')
const app = express();
app.use(cookie());
app.use(express.json()); // important to require a body from the api call
app.use(cors({
  origin: "http://localhost:5173",   // your frontend port
  credentials: true
}))


app.use('/api/auth', authRoutes);
app.use('/api/account', accRoutes);
app.use('/api/transactions',transactionRoutes)


module.exports = app