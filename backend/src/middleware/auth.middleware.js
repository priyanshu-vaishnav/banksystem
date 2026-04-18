const userModel = require("../models/user.model.js")
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ msg: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.id;   // important
        next();

    } catch (err) {
        return res.status(401).json({ msg: "Invalid or expired token" });
    }
}

async function authSystemUser(req, res, next) {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ msg: "Unauthorized user " });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findOne({
            _id: decoded.id
        }).select("+systemUser")

        if (!user.systemUser) {
            return res.staus(400).json({
                message: "forbidden user Access"
            })
        }



        req.userId = decoded.id;   // important
       return next();

    } catch (err) {
        return res.status(401).json({ msg: "Invalid or expired token" });
    }
}

module.exports = { auth ,authSystemUser};
