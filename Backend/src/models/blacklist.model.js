const mongoose = require('mongoose')

const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [ true, "token is required to be added in blacklist" ],
        index: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 7 * 24 * 60 * 60 // Automatically delete after 7 days (JWT expiry is 1 day)
    }
}, {
    timestamps: true
})

const tokenBlacklistModel = mongoose.model("blacklistTokens", blacklistTokenSchema)

module.exports = tokenBlacklistModel
