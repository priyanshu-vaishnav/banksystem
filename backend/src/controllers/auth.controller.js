const userModel = require("../models/user.model.js");
const tokenBlackListModel= require("../models/tokenBlacklist.model.js")
const cookie = require('cookie-parser');
const jwt = require('jsonwebtoken');
const emailService = require('../services/mail.service.js')
const register = async (req, res) => {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const Email = await userModel.findOne({ email });
    if (Email) {
        return res.status(400).json({ message: "Email already exists" });
    }

    if (password.length < 7) {
        return res.status(400).json({
            message: "password should be more than 7 digits"
        })
    }

    const user = await userModel.create({ email, name, password });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

    res.cookie('token', token, { httpOnly: true })


    res.status(201).json({ user, token });



    emailService.sendRegisterEmail(user.email, token)


};

const login = async (req, res) => {

    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");;
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    res.cookie('token', token, { httpOnly: true })
    res.status(200).json({
        msg: "login successful",
        user,
        token
    });

    emailService.sendLoginEmail(user.email, token)

};

async function logout(req, res) {

    const token = req.cookies.token

    if (!token) {
        return res.status(200).json({
            message: "User Already logout!!"
        })
    }

    await tokenBlackListModel.create({
        token: token
    })

    res.clearCookie("token")

    res.status(200).json({
        message: "User logged out successfully"
    })


}

module.exports = { register, login ,logout}