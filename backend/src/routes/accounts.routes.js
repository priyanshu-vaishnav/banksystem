const express = require("express");
const accountModel = require("../models/account.model.js");
const accountController = require('../controllers/account.controller.js')
const authMiddleware  = require('../middleware/auth.middleware.js')

const router = express.Router();


router.post('/createaccount',authMiddleware.auth,accountController.createAccount)
router.get('/myaccount',authMiddleware.auth,accountController.myAccount)
router.get("/getaccount/:accountId",accountController.findAccounts);
router.delete("/closeaccount",authMiddleware.auth,accountController.deleteAccount)
router.patch("/freezeaccount",authMiddleware.auth,accountController.freezeAccount)
router.patch('/unfreezeaccount',authMiddleware.auth,accountController.unfreezeAccount)
router.delete('/deleteaccount',authMiddleware.auth,accountController.deleteAccountPermanent)



module.exports = router;