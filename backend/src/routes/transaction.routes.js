const express = require("express")
const middleware = require('../middleware/auth.middleware.js')
const transactionController = require('../controllers/transaction.controller.js')
const router = express.Router();


router.post("/sendmoney", middleware.auth, transactionController.createTransaction)
router.post('/system/initialfunds',middleware.authSystemUser,transactionController.createInitialTransaction)
router.get('/mytransaction',middleware.auth,transactionController.getTransactionHistory)
module.exports= router