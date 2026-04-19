const express = require("express");
const authController = require('../controllers/auth.controller.js')
const authValidation = require('../middleware/auth.validation.js')
const authMiddleware = require('../middleware/auth.middleware.js')
const router = express.Router();

router.post('/register',authValidation,authController.register)
router.post('/login',authController.login)
router.post('/logout',authController.logout)
router.get('/check-system-user', authMiddleware.auth, authController.checkSystemUser)


module.exports = router; 
