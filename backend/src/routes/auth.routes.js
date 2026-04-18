const express = require("express");
const authController = require('../controllers/auth.controller.js')
const authValidation = require('../middleware/auth.validation.js')
const router = express.Router();

router.post('/register',authValidation,authController.register)
router.post('/login',authController.login)
router.post('/logout',authController.logout)


module.exports = router; 
