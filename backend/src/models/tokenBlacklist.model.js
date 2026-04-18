const mongoose = require('mongoose')

const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is required to blacklist"],
        unique: [true, "Token is already blacklisted"]
    }

}, { timestamps: true })

blacklistTokenSchema.index({ createdAt: 1 },
    { expireAfterSeconds: 60 * 60 * 24 * 1 }
)

const blacklistTokenModel = mongoose.model('blacklisttokens', blacklistTokenSchema)

module.exports = blacklistTokenModel