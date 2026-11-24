const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [ true, "username already taken" ],
        required: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        unique: [ true, "Account already exists with this email address" ],
        required: true,
        trim: true,
        lowercase: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        default: ""
    },
    avatar: {
        type: String,
        default: ""
    },
    targetRole: {
        type: String,
        default: "Software Engineer"
    },
    streak: {
        type: Number,
        default: 1
    },
    lastActiveAt: {
        type: Date,
        default: Date.now
    },
    preferences: {
        theme: { type: String, enum: ["dark", "light"], default: "dark" },
        emailNotifications: { type: Boolean, default: true },
        inAppReminders: { type: Boolean, default: true }
    }
}, {
    timestamps: true
})

const userModel = mongoose.model("users", userSchema)

module.exports = userModel
